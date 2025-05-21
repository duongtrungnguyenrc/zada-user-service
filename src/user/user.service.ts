import { RepositoryService } from "@duongtrungnguyen/micro-commerce";
import { ClientProxy } from "@nestjs/microservices";
import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { I18nService } from "nestjs-i18n";
import { NATS_CLIENT } from "~nats-client";
import { Repository } from "typeorm";

import { UserEntity } from "./entities";
import { UpdateUserDto } from "./dtos";
import { UserVM } from "./vms";

@Injectable()
export class UserService extends RepositoryService<UserEntity> {
  constructor(
    @InjectRepository(UserEntity) userRepository: Repository<UserEntity>,
    @Inject(NATS_CLIENT) private readonly natsClient: ClientProxy,
    private readonly i18nService: I18nService,
  ) {
    super(userRepository);
  }

  async updateAndSync(id: string, updates: UpdateUserDto): Promise<UserVM> {
    const updatedUser = await this.update({ id }, updates);

    if (updates.email || updates.phoneNumber) {
      this.natsClient.emit("auth.account.update", {
        id: updatedUser.id,
        updates: {
          email: updatedUser.email,
          phoneNumber: updatedUser.phoneNumber,
        },
      });
    }

    return updatedUser;
  }
}
