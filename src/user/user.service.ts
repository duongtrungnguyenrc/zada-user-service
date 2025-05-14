import { InjectRepository } from "@nestjs/typeorm";
import { genSaltSync, hashSync } from "bcrypt";
import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";

import { CreatedUserDto, CreateUserDto, UserCredentialDto, UserEntity } from "./models";

@Injectable()
export class UserService {
  constructor(@InjectRepository(UserEntity) private userRepository: Repository<UserEntity>) {}

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
}
