import { IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, IsUrl } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
  @ApiProperty()
  @IsString({ message: "validation.user.invalid-id" })
  @IsNotEmpty({ message: "validation.user.invalid-id" })
  id: string;

  @ApiProperty()
  @IsString({ message: "validation.user.invalid-full-name" })
  @IsNotEmpty()
  fullName: string;

  @ApiProperty()
  @IsEmail({}, { message: "validation.user.invalid-email" })
  email: string;

  @ApiProperty({ required: false })
  @IsUrl({}, { message: "validation.user.invalid-avatar-url" })
  @IsOptional()
  avatarUrl?: string;

  @ApiProperty()
  @IsPhoneNumber(undefined, {
    message: "validation.user.invalid-phone",
  })
  phoneNumber: string;
}
