import { AuthTokenPayload, BadRequestExceptionVM, HttpExceptionsFilter, HttpResponse, UnauthorizedExceptionVM } from "@duongtrungnguyen/micro-commerce";
import { ApiBadRequestResponse, ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { Body, Controller, Get, Put, UseFilters, UsePipes, ValidationPipe } from "@nestjs/common";
import { I18nService } from "nestjs-i18n";

import { UserService } from "./user.service";
import { UpdateUserDto } from "./dtos";
import { UserResponseVM } from "./vms";

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
  async get(@AuthTokenPayload("sub") id: string): Promise<UserResponseVM> {
    const user = await this.userService.get({ id });

    return HttpResponse.ok(this.i18nService.t("user.get-user-success"), user);
  }

  @Put()
  @ApiOperation({ summary: "Update user information" })
  @ApiBearerAuth()
  @ApiOkResponse({ description: "Update user information success", type: UserResponseVM })
  @ApiBadRequestResponse({ description: "Validation failed", type: BadRequestExceptionVM })
  @ApiUnauthorizedResponse({ description: "Missing auth token ", type: UnauthorizedExceptionVM })
  async update(@AuthTokenPayload("sub") id: string, @Body() data: UpdateUserDto): Promise<UserResponseVM> {
    const updatedUser = await this.userService.updateAndSync(id, data);

    return HttpResponse.ok(this.i18nService.t("user.update-user-success"), updatedUser);
  }
}
