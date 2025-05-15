import { Injectable, NotFoundException } from "@nestjs/common";
import { FindOptionsWhere, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { genSaltSync, hashSync } from "bcrypt";
import { I18nService } from "nestjs-i18n";

import { CreatedUserDto, CreateUserDto, UpdateUserDto, UserCredentialDto } from "./dtos";
import { UserEntity } from "./entities";
import { IUser } from "./interfaces";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
    private readonly i18nService: I18nService,
  ) {}

  async create(user: CreateUserDto): Promise<CreatedUserDto> {
    const { password, ...restUser } = user;

    const salt: string = genSaltSync(5);

    const { passwordHash: _, ...createdUser } = await this.userRepository.save({
      ...restUser,
      passwordHash: hashSync(password, salt),
    });

    return createdUser;
  }

  async getCredential(email: string): Promise<UserCredentialDto> {
    return await this.userRepository.findOne({
      where: { email },
      select: ["id", "email", "passwordHash", "isActive"],
    });
  }

  async getUser(filter: FindOptionsWhere<IUser>, select?: (keyof IUser)[]): Promise<IUser> {
    return await this.userRepository.findOne({
      where: filter,
      select: select,
    });
  }

  async updateUser(filter: FindOptionsWhere<IUser>, updates: UpdateUserDto): Promise<IUser> {
    const user = await this.getUser(filter);

    if (!user) {
      throw new NotFoundException(this.i18nService.t("user.not-found"));
    }

    const { password, ...restUpdates } = updates;

    if (password) {
      const salt: string = genSaltSync(5);
      Object.assign(restUpdates, {
        passwordHash: hashSync(password, salt),
      });
    }

    return await this.userRepository.save({
      ...user,
      ...restUpdates,
    });
  }
}
