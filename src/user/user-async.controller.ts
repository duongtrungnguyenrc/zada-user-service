import { MessagePattern } from "@nestjs/microservices";
import { Controller } from "@nestjs/common";

import { UpdateUserAsyncDto, CreateUserDto } from "./dtos";
import { UserService } from "./user.service";
import { UserVM } from "./vms";

@Controller()
export class UserAsyncController {
  constructor(private readonly userService: UserService) {}

  // Async internal task

  @MessagePattern("user.create")
  async createUserAsync(data: CreateUserDto): Promise<UserVM> {
    console.log("call create");

    return await this.userService.create(data);
  }

  @MessagePattern("user.update")
  async updateUserAsync(data: UpdateUserAsyncDto): Promise<UserVM> {
    return await this.userService.update({ id: data.id }, data.updates);
  }
}
