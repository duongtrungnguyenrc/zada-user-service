import { IsBoolean, IsOptional, IsPhoneNumber, IsString, IsUrl, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateUserDto {
  @ApiProperty()
  @IsString({ message: "validation.user.invalid-full-name" })
  @IsOptional()
  fullName?: string;

  @ApiProperty()
  @IsUrl({}, { message: "validation.user.invalid-avatar-url" })
  @IsOptional()
  avatarUrl?: string;

  @ApiProperty()
  @IsString({ message: "validation.user.invalid-string" })
  @MinLength(6, { message: "validation.user.invalid-password" })
  @IsOptional()
  passwordHash?: string;

  @ApiProperty()
  @IsPhoneNumber(undefined, {
    message: "validation.user.invalid-phone",
  })
  @IsOptional()
  phoneNumber?: string;

  @ApiProperty()
  @IsBoolean({ message: "validation.user.invalid-is-verified" })
  @IsOptional()
  isVerified?: boolean;

  @ApiProperty()
  @IsBoolean({ message: "validation.user.invalid-is-active" })
  @IsOptional()
  isActive?: boolean;

  @ApiProperty()
  @IsBoolean({ message: "validation.user.invalid-is-seller" })
  @IsOptional()
  isSeller?: boolean;
}
