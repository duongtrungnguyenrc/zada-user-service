import { Injectable, NotFoundException } from "@nestjs/common";
import { FindOptionsWhere, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { I18nService } from "nestjs-i18n";

import { CreateUserDto, UpdateUserDto } from "./dtos";
import { UserEntity } from "./entities";
import { IUser } from "./interfaces";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly i18nService: I18nService,
  ) {}

  async create(data: CreateUserDto): Promise<UserEntity> {
    const user = this.userRepository.create(data);
    return await this.userRepository.save(user);
  }

  async get(filter: FindOptionsWhere<IUser>, select?: (keyof IUser)[]): Promise<UserEntity | null> {
    return await this.userRepository.findOne({ where: filter, select });
  }

  async getMultiple(filter: FindOptionsWhere<IUser>, select?: (keyof IUser)[]): Promise<Array<UserEntity>> {
    return await this.userRepository.find({ where: filter, select });
  }

  async findOneOrFail(filter: FindOptionsWhere<IUser>, select?: (keyof IUser)[]): Promise<UserEntity> {
    const user = await this.get(filter, select);
    if (!user) {
      throw new NotFoundException(this.i18nService.t("user.not-found"));
    }
    return user;
  }

  async update(filter: FindOptionsWhere<IUser>, updates: UpdateUserDto): Promise<UserEntity> {
    const user = await this.findOneOrFail(filter);
    Object.assign(user, updates);
    return await this.userRepository.save(user);
  }
}
