import { AuthTokenPayload, BadRequestExceptionVM, HttpExceptionsFilter, HttpResponse, UnauthorizedExceptionVM } from "@duongtrungnguyen/micro-commerce";
import { ApiBadRequestResponse, ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { Body, Controller, Get, Put, UseFilters, UsePipes, ValidationPipe } from "@nestjs/common";
import { MessagePattern } from "@nestjs/microservices";
import { I18nService } from "nestjs-i18n";

import { UpdateUserDto, UpdateUserAsyncDto } from "./dtos";
import { UserResponseVM, UserVM } from "./vms";
import { UserService } from "./user.service";

@ApiTags("User")
@Controller()
@UsePipes(ValidationPipe)
@UseFilters(HttpExceptionsFilter)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private i18nService: I18nService,
  ) {}

  @Get()
  @ApiOperation({ summary: "Get user information" })
  @ApiBearerAuth()
  @ApiOkResponse({ description: "Get user success", type: UserResponseVM })
  @ApiUnauthorizedResponse({ description: "Missing auth token ", type: UnauthorizedExceptionVM })
  async getProfile(@AuthTokenPayload("sub") userId: string): Promise<UserResponseVM> {
    const user = await this.userService.get({ id: userId }, ["id", "email", "fullName", "phoneNumber", "avatarUrl", "createdAt", "updatedAt"]);

    return HttpResponse.ok(this.i18nService.t("user.get-user-success"), user);
  }

  @Put()
  @ApiOperation({ summary: "Update user information" })
  @ApiBearerAuth()
  @ApiOkResponse({ description: "Update user information success", type: UserResponseVM })
  @ApiBadRequestResponse({ description: "Validation failed", type: BadRequestExceptionVM })
  @ApiUnauthorizedResponse({ description: "Missing auth token ", type: UnauthorizedExceptionVM })
  async updateProfile(@AuthTokenPayload("sub") userId: string, @Body() data: UpdateUserDto): Promise<UserResponseVM> {
    const updatedProfile = await this.userService.update({ id: userId }, data);

    return HttpResponse.ok(this.i18nService.t("user.update-user-success"), updatedProfile);
  }

  // Async internal task
  @MessagePattern("user.update")
  async updateUserAsync(data: UpdateUserAsyncDto): Promise<UserVM> {
    return await this.userService.update({ id: data.id }, data.updates);
  }
}
