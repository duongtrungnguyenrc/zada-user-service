import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";

import { UserModule } from "~user";
import { JwtModule } from "~jwt";

import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { SessionEntity } from "./models";

@Module({
  imports: [TypeOrmModule.forFeature([SessionEntity]), UserModule, JwtModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
