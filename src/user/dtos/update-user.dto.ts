import { IsBoolean, IsEmail, IsOptional, IsPhoneNumber, IsString, IsUrl } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateUserDto {
  @ApiProperty()
  @IsString({ message: "validation.user.invalid-full-name" })
  @IsOptional()
  fullName?: string;

  @ApiProperty({ required: false })
  @IsEmail({}, { message: "validation.user.invalid-email" })
  @IsOptional()
  email?: string;

  @ApiProperty()
  @IsUrl({}, { message: "validation.user.invalid-avatar-url" })
  @IsOptional()
  avatarUrl?: string;

  @ApiProperty()
  @IsPhoneNumber(undefined, {
    message: "validation.user.invalid-phone",
  })
  @IsOptional()
  phoneNumber?: string;

  @ApiProperty()
  @IsBoolean({ message: "validation.user.invalid-is-seller" })
  @IsOptional()
  isSeller?: boolean;
}
