import { IsEmail, IsOptional, IsPhoneNumber, IsString, IsUrl } from "class-validator";

export class CreateUserDto {
  @IsString()
  fullName: string;

  @IsEmail()
  email: string;

  @IsUrl()
  @IsOptional()
  avatarUrl?: string;

  @IsString()
  password: string;

  @IsPhoneNumber()
  phoneNumber: string;
}
