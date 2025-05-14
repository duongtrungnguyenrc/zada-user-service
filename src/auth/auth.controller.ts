import { AuthToken, IpAddress, RequestAgent, UserAgent } from "@duongtrungnguyen/micro-commerce";
import { Body, Controller, HttpCode, Post } from "@nestjs/common";

import { CreateUserDto } from "~user";

import { AuthService } from "./auth.service";
import { LoginDto } from "./models";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  async register(@Body() data: CreateUserDto) {
    return await this.authService.register(data);
  }

  @Post("/login")
  @HttpCode(200)
  async login(@Body() data: LoginDto, @IpAddress() ip: string, @RequestAgent() userAgent: UserAgent) {
    return await this.authService.login(data, ip, userAgent);
  }

  @Post("refresh")
  async refreshToken(@AuthToken() oldToken: string) {
    return this.authService.refreshToken(oldToken);
  }

  @Post("verify-email")
  verifyEmail() {}

  @Post("verify-phone")
  verifyPhone() {}

  @Post("social-login")
  socialLogin() {}
}
