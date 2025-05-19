import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsEmail, IsPhoneNumber, IsBoolean } from "class-validator";

export class CreateAddressDto {
  @ApiProperty()
  @IsString({ message: "validation.address.invalid-recipient-name" })
  recipientName: string;

  @ApiProperty()
  @IsEmail({}, { message: "validation.address.invalid-recipient-email" })
  recipientEmail: string;

  @ApiProperty()
  @IsPhoneNumber(undefined, { message: "validation.address.invalid-phone" })
  phoneNumber: string;

  @ApiProperty()
  @IsString({ message: "validation.address.invalid-street" })
  street: string;

  @ApiProperty()
  @IsString({ message: "validation.address.invalid-city" })
  city: string;

  @ApiProperty()
  @IsString({ message: "validation.address.invalid-district" })
  district: string;

  @ApiProperty()
  @IsString({ message: "validation.address.invalid-country" })
  country: string;

  @ApiProperty()
  @IsString({ message: "validation.address.invalid-postal-code" })
  postalCode: string;

  @ApiProperty()
  @IsBoolean({ message: "validation.address.invalid-is-default" })
  isDefault: boolean;
}
