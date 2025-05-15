import { IsJWT } from "class-validator";

export class LoginResponseDto {
  @IsJWT()
  token: string;
}
