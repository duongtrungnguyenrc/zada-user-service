import { Inject, Injectable, NotAcceptableException, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { JwtPayload, ResponseEntity, UserAgent } from "@duongtrungnguyen/micro-commerce";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { ClientProxy } from "@nestjs/microservices";
import { ConfigService } from "@nestjs/config";
import { I18nService } from "nestjs-i18n";
import { Cache } from "cache-manager";
import { Response } from "express";
import { v4 as uuid } from "uuid";
import { compare } from "bcrypt";

import { CreatedUserDto, CreateUserDto, IUser, UserCredentialDto, UserService } from "~user";
import { EOauthProvider, OAuthStrategy, OAuthStrategyFactory } from "~auth/oauth";
import { SessionService } from "~auth/session";
import { NATS_CLIENT } from "~nats-client";
import { JwtService } from "~auth/jwt";

import { ForgotPasswordDto, LoginDto, LoginResponseDto, ResetPasswordDto, VerifyAccountDto } from "./dtos";
import { ForgotPasswordSession, VerifyAccountSession } from "./types";

@Injectable()
export class AuthService {
  constructor(
    @Inject(NATS_CLIENT) private readonly natsClient: ClientProxy,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly oauthFactory: OAuthStrategyFactory,
    private readonly sessionService: SessionService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly i18nService: I18nService,
    private readonly jwtService: JwtService,
  ) {}

  async register(data: CreateUserDto, ip: string, response: Response): Promise<void> {
    const createdUser: CreatedUserDto = await this.userService.create(data);

    await this.requestVerifyAccount(createdUser.id, ip);

    const clientBaseUrl: string = this.configService.get<string>("CLIENT_BASE_URL");
    const accountVerifyPath: string = this.configService.get<string>("ACCOUNT_VERIFY_PATH");

    response.redirect(`${clientBaseUrl}/${accountVerifyPath}?userId=${createdUser.id}`);
  }

  async login(data: LoginDto, ip: string, userAgent: UserAgent): Promise<ResponseEntity<LoginResponseDto>> {
    const credential: UserCredentialDto = await this.userService.getCredential(data.email);

    if (!credential) {
      throw new UnauthorizedException(this.i18nService.t("auth.user-not-found"));
    }

    if (!credential.isActive) {
      throw new UnauthorizedException(this.i18nService.t("auth.user-inactive"));
    }

    const matchPassword: boolean = await compare(data.password, credential.passwordHash);

    if (!matchPassword) {
      throw new UnauthorizedException(this.i18nService.t("auth.invalid-login"));
    }

    const jit: string = uuid();

    const token: string = this.jwtService.generateToken({
      sub: credential.id,
      jit,
    });

    await this.sessionService.createSession({
      user: { id: credential.id },
      jit,
      ip,
      userAgent,
    });

    return {
      message: this.i18nService.t("auth.login-success"),
      data: {
        token,
      },
      code: 200,
    };
  }

  async getOauthUrl(provider: EOauthProvider): Promise<ResponseEntity<string>> {
    const oauthStrategy: OAuthStrategy = this.oauthFactory.getStrategy(provider);

    return {
      message: this.i18nService.t("auth.get-oauth-success"),
      data: oauthStrategy.getAuthUrl(),
      code: 200,
    };
  }

  async handleOAuthCallback(
    provider: EOauthProvider,
    code: string,
    ip: string,
    userAgent: UserAgent,
    response: Response,
  ): Promise<void> {
    const strategy: OAuthStrategy = this.oauthFactory.getStrategy(provider);

    const token: string = await strategy.handleCallback(code, ip, userAgent);
    const clientBaseUrl: string = this.configService.get<string>("CLIENT_BASE_URL");
    const oauthWebhooksPath: string = this.configService.get<string>("OAUTH_WEBHOOKS_PATH");

    response.redirect(`${clientBaseUrl}/${oauthWebhooksPath}?token=${token}`);
  }

  async logOut(oldToken: string): Promise<ResponseEntity<undefined>> {
    const payload: JwtPayload = await this.jwtService.verifyToken(oldToken);

    const { sub: userId, jit } = payload;

    await Promise.all([
      this.sessionService.updateSession(
        {
          jit,
          user: {
            id: userId,
          },
        },
        {
          expiresAt: null,
        },
      ),
      this.jwtService.revokeToken(payload),
    ]);

    return {
      message: this.i18nService.t("auth.logout-success"),
      data: undefined,
      code: 200,
    };
  }

  async refreshToken(oldToken: string, ip: string, userAgent: UserAgent): Promise<ResponseEntity<LoginResponseDto>> {
    if (!oldToken) {
      throw new UnauthorizedException(this.i18nService.t("auth.no-auth"));
    }

    const payload: JwtPayload = await this.jwtService.verifyToken(oldToken);

    if (!payload) {
      throw new UnauthorizedException(this.i18nService.t("auth.no-auth"));
    }

    const { sub: userId, jit } = payload;

    const newJit: string = uuid();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 14);

    await this.sessionService.updateSession(
      { jit, user: { id: userId } },
      {
        jit: newJit,
        expiresAt: expiresAt,
        ip: ip,
        userAgent: userAgent,
      },
    );

    const newToken: string = this.jwtService.generateToken({ sub: userId, jit: newJit });
    await this.jwtService.revokeToken(payload);

    return {
      code: 200,
      message: this.i18nService.t("auth.refresh-success"),
      data: {
        token: newToken,
      },
    };
  }

  async requestVerifyAccount(userId: string, ip: string): Promise<ResponseEntity<undefined>> {
    const user = await this.userService.getUser({ id: userId }, ["id", "email", "fullName"]);

    if (!user) {
      throw new NotFoundException(this.i18nService.t("user.not-found"));
    }

    const otp: string = this._generateOtp();
    const sessionId: string = uuid();

    await this.cacheManager.set<VerifyAccountSession>(
      `otp:verify-user:${sessionId}`,
      { otp, userId: userId, ip },
      15 * 60 * 1000,
    );

    this.natsClient.emit("noti.email.verify-account", {
      otp,
      email: user.email,
      fullName: user.fullName,
    });

    return {
      message: this.i18nService.t("auth.send-verify-account-success"),
      data: undefined,
      code: 201,
    };
  }

  async verifyAccount(data: VerifyAccountDto, ip: string, newUser?: IUser): Promise<ResponseEntity<undefined>> {
    const cachedSession: ForgotPasswordSession = await this.cacheManager.get<ForgotPasswordSession>(
      `otp:verify-account:${data.sessionId}`,
    );

    if (!cachedSession) {
      throw new NotAcceptableException(this.i18nService.t("auth.no-verify-account-found"));
    }

    if (!(ip === cachedSession.ip)) {
      throw new NotAcceptableException(this.i18nService.t("auth.invalid-ip"));
    }

    if (!(data.otp === cachedSession.otp)) {
      throw new NotAcceptableException(this.i18nService.t("auth.otp-incorrect"));
    }

    await this.userService.updateUser(
      { id: cachedSession.userId },
      {
        isVerified: true,
      },
    );

    if (newUser) {
      this.natsClient.emit("noti.email.new-user", {
        userName: newUser.fullName,
        email: newUser.email,
      });

      return {
        message: this.i18nService.t("auth.register-success"),
        data: undefined,
        code: 201,
      };
    }

    return {
      message: this.i18nService.t("auth.verify-account-success"),
      data: undefined,
      code: 200,
    };
  }

  async forgotPassword(data: ForgotPasswordDto, ip: string): Promise<ResponseEntity<undefined>> {
    const user: IUser = await this.userService.getUser({ id: data.userId }, ["id", "email", "fullName"]);

    if (!user) {
      throw new NotFoundException(this.i18nService.t("user.not-found"));
    }

    const otp: string = this._generateOtp();
    const sessionId: string = uuid();

    await this.cacheManager.set<ForgotPasswordSession>(
      `otp:reset-password:${sessionId}`,
      { otp, userId: user.id, ip },
      15 * 60 * 1000,
    );

    this.natsClient.emit("noti.email.reset-password", {
      otp,
      email: user.email,
      fullName: user.fullName,
    });

    return {
      message: this.i18nService.t("auth.forgot-password-success"),
      data: undefined,
      code: 201,
    };
  }

  async resetPassword(data: ResetPasswordDto, ip: string): Promise<ResponseEntity<undefined>> {
    const cachedSession: ForgotPasswordSession = await this.cacheManager.get<ForgotPasswordSession>(
      `otp:reset-password:${data.sessionId}`,
    );

    if (!cachedSession) {
      throw new NotAcceptableException(this.i18nService.t("auth.no-reset-password-found"));
    }

    if (!(ip === cachedSession.ip)) {
      throw new NotAcceptableException(this.i18nService.t("auth.invalid-ip"));
    }

    if (!(data.otp === cachedSession.otp)) {
      throw new NotAcceptableException(this.i18nService.t("auth.otp-incorrect"));
    }

    await this.userService.updateUser(
      { id: cachedSession.userId },
      {
        password: data.newPassword,
      },
    );

    return {
      message: this.i18nService.t("auth.reset-password-success"),
      data: undefined,
      code: 201,
    };
  }

  /* Internal support methods */

  private _generateOtp(): string {
    return Array(6)
      .fill(0)
      .map(() => Math.floor(Math.random() * 10))
      .join("");
  }
}
