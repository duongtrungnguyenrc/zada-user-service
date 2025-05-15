import { UserAgent } from "@duongtrungnguyen/micro-commerce";
import { IsObject, IsString, IsUUID } from "class-validator";

import { IUser } from "~user";

export class CreateSessionDto {
  @IsUUID()
  jit: string;

  @IsObject()
  user: Partial<IUser>;

  @IsObject()
  userAgent: UserAgent;

  @IsString()
  ip: string;
}
