import { IsOptional, IsString, IsEmail, IsPhoneNumber, IsBoolean } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateAddressDto {
  @ApiProperty({ required: false })
  @IsString({ message: "validation.address.invalid-recipient-name" })
  @IsOptional()
  recipientName?: string;

  @ApiProperty({ required: false })
  @IsEmail({}, { message: "validation.address.invalid-recipient-email" })
  @IsOptional()
  recipientEmail?: string;

  @ApiProperty({ required: false })
  @IsPhoneNumber(undefined, { message: "validation.address.invalid-phone" })
  @IsOptional()
  phoneNumber?: string;

  @ApiProperty({ required: false })
  @IsString({ message: "validation.address.invalid-street" })
  @IsOptional()
  street?: string;

  @ApiProperty({ required: false })
  @IsString({ message: "validation.address.invalid-city" })
  @IsOptional()
  city?: string;

  @ApiProperty({ required: false })
  @IsString({ message: "validation.address.invalid-district" })
  @IsOptional()
  district?: string;

  @ApiProperty({ required: false })
  @IsString({ message: "validation.address.invalid-country" })
  @IsOptional()
  country?: string;

  @ApiProperty({ required: false })
  @IsString({ message: "validation.address.invalid-postal-code" })
  @IsOptional()
  postalCode?: string;

  @ApiProperty({ required: false })
  @IsBoolean({ message: "validation.address.invalid-is-default" })
  @IsOptional()
  isDefault?: boolean;
}
