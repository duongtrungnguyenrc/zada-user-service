import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { ResponseEntity, UserAgent } from "@duongtrungnguyen/micro-commerce";
import { InjectRepository } from "@nestjs/typeorm";
import { I18nService } from "nestjs-i18n";
import { Repository } from "typeorm";
import { compareSync } from "bcrypt";
import { v4 as uuid } from "uuid";

import { CreatedUserDto, CreateUserDto, UserService } from "~user";
import { JwtService } from "~jwt";

import { LoginDto, LoginResponseDto, SessionEntity } from "./models";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(SessionEntity) private readonly sessionRepository: Repository<SessionEntity>,
    private readonly userService: UserService,
    private readonly i18nService: I18nService,
    private readonly jwtService: JwtService,
  ) {}

  async register(data: CreateUserDto): Promise<ResponseEntity<CreatedUserDto>> {
    const createdUser = await this.userService.create(data);

    return {
      message: this.i18nService.t("auth.register-success"),
      data: createdUser,
      code: 201,
    };
  }

  async login(data: LoginDto, ip: string, userAgent: UserAgent): Promise<ResponseEntity<LoginResponseDto>> {
    const credential = await this.userService.getCredential(data.email);

    if (!credential) {
      throw new UnauthorizedException(this.i18nService.t("auth.user-not-found"));
    }

    if (!credential.isActive) {
      throw new UnauthorizedException(this.i18nService.t("auth.user-inactive"));
    }

    const matchPassword = compareSync(data.password, credential.passwordHash);

    if (!matchPassword) {
      throw new UnauthorizedException(this.i18nService.t("auth.invalid-login"));
    }

    const token = await this.generateToken(credential.id, ip, userAgent);

    return {
      message: this.i18nService.t("auth.login-success"),
      data: {
        token,
      },
      code: 200,
    };
  }

  async logout(oldToken: string): Promise<ResponseEntity<null>> {
    const payload = await this.jwtService.verifyToken(oldToken);

    const { sub: userId, jit } = payload;

    const session = await this.sessionRepository.findOne({
      where: { jit, user: { id: userId } },
      relations: ["user"],
    });

    if (!session) {
      throw new NotFoundException(this.i18nService.t("auth.session-not-found"));
    }

    session.expiresAt = null;

    await Promise.all([this.sessionRepository.save(session), this.jwtService.revokeToken(payload)]);

    return {
      code: 200,
      message: this.i18nService.t("auth.logout-success"),
      data: null,
    };
  }

  async refreshToken(oldToken: string): Promise<ResponseEntity<LoginResponseDto>> {
    if (!oldToken) {
      throw new UnauthorizedException(this.i18nService.t("auth.no-auth"));
    }

    const payload = await this.jwtService.verifyToken(oldToken);

    if (!payload) {
      throw new UnauthorizedException(this.i18nService.t("auth.no-auth"));
    }

    const { sub: userId, jit } = payload;

    const session = await this.sessionRepository.findOne({
      where: { jit, user: { id: userId } },
      relations: ["user"],
    });

    if (!session) {
      throw new UnauthorizedException(this.i18nService.t("auth.session-not-found"));
    }

    const now = new Date();

    if (!session.expiresAt || session.expiresAt < now) {
      throw new UnauthorizedException(this.i18nService.t("auth.session-expired"));
    }

    const newJit = uuid();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 14);

    session.jit = newJit;
    session.expiresAt = expiresAt;

    await this.sessionRepository.save(session);

    const newToken = this.jwtService.generateToken({ sub: userId, jit: newJit });

    return {
      code: 200,
      message: this.i18nService.t("auth.refresh-success"),
      data: {
        token: newToken,
      },
    };
  }

  verifyEmail() {}

  verifyPhone() {}

  socialLogin() {}

  forgotPassword() {}

  resetPassword() {}

  // internal

  private async generateToken(userId: string, ip: string, userAgent: UserAgent, oldJit?: string): Promise<string> {
    const jit: string = oldJit ?? uuid();

    await this.saveSession(userId, jit, ip, userAgent);

    return this.jwtService.generateToken({
      sub: userId,
      jit,
    });
  }

  private saveSession(userId: string, jit: string, ip: string, userAgent: UserAgent) {
    const expiresAt = new Date();

    expiresAt.setDate(expiresAt.getDate() + 14);

    const session = this.sessionRepository.create({
      user: { id: userId },
      jit,
      ip,
      userAgent,
      expiresAt,
    });

    return this.sessionRepository.save(session);
  }
}
