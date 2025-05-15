import { Module } from "@nestjs/common";

import { SessionModule } from "~auth/session";
import { OauthModule } from "~auth/oauth";
import { JwtModule } from "~auth/jwt";
import { UserModule } from "~user";

import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

@Module({
  imports: [UserModule, JwtModule, SessionModule, OauthModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
