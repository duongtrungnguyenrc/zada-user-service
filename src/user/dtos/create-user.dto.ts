import { IsEmail, IsOptional, IsPhoneNumber, IsString, IsUrl } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
  @ApiProperty()
  @IsString({ message: "validation.user.invalid-full-name" })
  fullName: string;

  @ApiProperty()
  @IsEmail({}, { message: "validation.user.invalid-email" })
  email: string;

  @ApiProperty()
  @IsUrl({}, { message: "validation.user.invalid-avatar-url" })
  @IsOptional()
  avatarUrl?: string;

  @ApiProperty()
  @IsString({ message: "validation.user.invalid-password" })
  passwordHash: string;

  @ApiProperty()
  @IsPhoneNumber(undefined, {
    message: "validation.user.invalid-phone",
  })
  phoneNumber: string;
}
