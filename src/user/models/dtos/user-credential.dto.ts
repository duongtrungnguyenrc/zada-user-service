import { IsBoolean, IsEmail, IsString, IsUUID } from "class-validator";

export class UserCredentialDto {
  @IsUUID()
  id: string;

  @IsEmail()
  email: string;

  @IsString()
  passwordHash: string;

  @IsBoolean()
  isActive: boolean;
}
