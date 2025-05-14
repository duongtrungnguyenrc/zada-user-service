import { IsBoolean, IsDateString, IsEmail, IsOptional, IsPhoneNumber, IsString, IsUrl, IsUUID } from "class-validator";

export class CreatedUserDto {
  @IsUUID()
  id: string;

  @IsEmail()
  email: string;

  @IsUrl()
  @IsOptional()
  avatarUrl?: string;

  @IsPhoneNumber()
  phoneNumber: string;

  @IsString()
  fullName: string;

  @IsDateString()
  createdAt: string;

  @IsBoolean()
  isActive: boolean;

  @IsBoolean()
  isEmailVerified: boolean;
}
