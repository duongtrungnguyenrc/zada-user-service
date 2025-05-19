import { ApiBadRequestResponse, ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { Body, Controller, Get, Put, UseFilters, UsePipes, ValidationPipe } from "@nestjs/common";
import { AuthTokenPayload, BadRequestExceptionVM, HttpExceptionsFilter, UnauthorizedExceptionVM } from "@duongtrungnguyen/micro-commerce";
import { MessagePattern } from "@nestjs/microservices";
import { I18nService } from "nestjs-i18n";

import { UpdateProfileDto, UpdateUserAsyncDto } from "./dtos";
import { UserService } from "./user.service";
import { ProfileResponseVM, ProfileVM } from "./vms";

@ApiTags("User")
@Controller()
@UsePipes(ValidationPipe)
@UseFilters(HttpExceptionsFilter)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private i18nService: I18nService,
  ) {}

  @Get("profile")
  @ApiOperation({ summary: "Get user profile" })
  @ApiBearerAuth()
  @ApiOkResponse({ description: "Get user profile success", type: ProfileResponseVM })
  @ApiUnauthorizedResponse({ description: "Missing auth token ", type: UnauthorizedExceptionVM })
  async getProfile(@AuthTokenPayload("sub") userId: string): Promise<ProfileResponseVM> {
    const profile = await this.userService.get({ id: userId }, ["id", "email", "fullName", "phoneNumber", "avatarUrl", "createdAt", "updatedAt"]);

    return {
      message: this.i18nService.t("user.get-profile-success"),
      data: profile,
    };
  }

  @Put("profile")
  @ApiBearerAuth()
  @ApiOkResponse({ description: "Update profile success", type: ProfileResponseVM })
  @ApiBadRequestResponse({ description: "Validation failed", type: BadRequestExceptionVM })
  @ApiUnauthorizedResponse({ description: "Missing auth token ", type: UnauthorizedExceptionVM })
  async updateProfile(@AuthTokenPayload("sub") userId: string, @Body() data: UpdateProfileDto): Promise<ProfileResponseVM> {
    const updatedProfile = await this.userService.update({ id: userId }, data);

    return {
      message: this.i18nService.t("user.update-profile-success"),
      data: updatedProfile,
    };
  }

  // Async internal task
  @MessagePattern("user.update")
  async updateUserAsync(data: UpdateUserAsyncDto): Promise<ProfileVM> {
    return await this.userService.update({ id: data.id }, data.updates);
  }
}
