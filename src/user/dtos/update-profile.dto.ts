import { IsOptional, IsPhoneNumber, IsString, IsUrl } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateProfileDto {
  @ApiProperty()
  @IsString({ message: "validation.user.invalid-full-name" })
  @IsOptional()
  fullName?: string;

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
}
