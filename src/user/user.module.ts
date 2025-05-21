import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";

import { UserAsyncController } from "./user-async.controller";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { UserEntity } from "./entities";

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UserController, UserAsyncController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
