import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { FindOptionsWhere, Repository } from "typeorm";
import { ClientProxy } from "@nestjs/microservices";
import { InjectRepository } from "@nestjs/typeorm";
import { I18nService } from "nestjs-i18n";
import { NATS_CLIENT } from "~nats-client";

import { CreateUserDto, UpdateUserDto } from "./dtos";
import { UserEntity } from "./entities";
import { IUser } from "./interfaces";
import { UserVM } from "./vms";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
    @Inject(NATS_CLIENT) private readonly natsClient: ClientProxy,
    private readonly i18nService: I18nService,
  ) {}

  async create(data: CreateUserDto): Promise<UserVM> {
    const user = this.userRepository.create(data);
    return await this.userRepository.save(user);
  }

  async get(filter: FindOptionsWhere<UserEntity> | FindOptionsWhere<UserEntity>[], select?: (keyof IUser)[]): Promise<UserVM | null> {
    return await this.userRepository.findOne({ where: filter, select });
  }

  async getMultiple(filter: FindOptionsWhere<UserEntity>, select?: (keyof IUser)[]): Promise<Array<UserVM>> {
    return await this.userRepository.find({ where: filter, select });
  }

  async findOneOrFail(filter: FindOptionsWhere<UserEntity>, select?: (keyof IUser)[]): Promise<UserVM> {
    const user = await this.get(filter, select);
    if (!user) {
      throw new NotFoundException(this.i18nService.t("user.not-found"));
    }
    return user;
  }

  async update(filter: FindOptionsWhere<UserEntity>, updates: UpdateUserDto): Promise<UserVM> {
    const user = await this.findOneOrFail(filter);
    Object.assign(user, updates);

    /* Sync to auth when email or password changes*/

    if (updates.email || updates.phoneNumber) {
      this.natsClient.emit("auth.account.update", {
        id: user.id,
        updates: {
          email: updates.email,
          phoneNumber: updates.phoneNumber,
        },
      });
    }

    return await this.userRepository.save(user);
  }
}
