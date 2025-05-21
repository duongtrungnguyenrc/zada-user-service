import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiParam,
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
} from "@nestjs/swagger";
import {
  AuthTokenPayload,
  BadRequestExceptionVM,
  HttpExceptionsFilter,
  HttpResponse,
  NotFoundExceptionVM,
  ResponseVM,
  UnauthorizedExceptionVM,
} from "@duongtrungnguyen/micro-commerce";
import { Body, Controller, Delete, Get, Param, Post, Put, UseFilters } from "@nestjs/common";
import { I18nService } from "nestjs-i18n";

import { AddressesResponseVM, AddressResponseVM } from "./vms";
import { CreateAddressDto, UpdateAddressDto } from "./dtos";
import { AddressService } from "./address.service";

@ApiTags("Address")
@Controller("addresses")
@UseFilters(new HttpExceptionsFilter())
export class AddressController {
  constructor(
    private readonly addressService: AddressService,
    private readonly i18nService: I18nService,
  ) {}

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get all addresses" })
  @ApiOkResponse({ description: "List of addresses returned", type: AddressesResponseVM })
  @ApiUnauthorizedResponse({ description: "Missing auth token", type: UnauthorizedExceptionVM })
  async getAddresses(@AuthTokenPayload("sub") userId?: string): Promise<AddressesResponseVM> {
    const addresses = await this.addressService.getMultiple({ id: userId });

    return HttpResponse.ok(this.i18nService.t("address.addresses-success"), addresses);
  }

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: "Create a new address" })
  @ApiBody({ type: CreateAddressDto })
  @ApiCreatedResponse({ description: "Address successfully created", type: AddressResponseVM })
  @ApiBadRequestResponse({ description: "Validation failed", type: BadRequestExceptionVM })
  @ApiUnauthorizedResponse({ description: "Missing auth token", type: UnauthorizedExceptionVM })
  async create(@AuthTokenPayload("sub") userId: string, @Body() data: CreateAddressDto): Promise<AddressResponseVM> {
    const createdAddress = await this.addressService.create({
      user: { id: userId },
      ...data,
    });

    return HttpResponse.created(this.i18nService.t("address.create-success"), createdAddress);
  }

  @Put(":id")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update an address by ID" })
  @ApiParam({ name: "id", description: "Address UUID" })
  @ApiBody({ type: UpdateAddressDto })
  @ApiOkResponse({ description: "Address successfully updated", type: AddressResponseVM })
  @ApiBadRequestResponse({ description: "Validation failed", type: BadRequestExceptionVM })
  @ApiUnauthorizedResponse({ description: "Missing auth token", type: UnauthorizedExceptionVM })
  @ApiNotFoundResponse({ description: "Not found address to update", type: NotFoundExceptionVM })
  async update(@Param("id") id: string, @Body() data: UpdateAddressDto): Promise<AddressResponseVM> {
    const updatedAddress = await this.addressService.updateOrThrow({ id }, data, { notFoundMessage: this.i18nService.t("address.not-found") });

    return HttpResponse.ok(this.i18nService.t("address.update-success"), updatedAddress);
  }

  @Delete(":id")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Delete an address by ID" })
  @ApiParam({ name: "id", description: "Address UUID" })
  @ApiOkResponse({ description: "Address successfully deleted", type: ResponseVM })
  @ApiNotFoundResponse({ description: "Not found address to delete", type: NotFoundExceptionVM })
  @ApiUnauthorizedResponse({ description: "Missing auth token", type: UnauthorizedExceptionVM })
  async delete(@Param("id") id: string): Promise<ResponseVM> {
    await this.addressService.deleteOrThrow({ id }, this.i18nService.t("address.not-found"));

    return HttpResponse.ok(this.i18nService.t("address.delete-success"));
  }
}
