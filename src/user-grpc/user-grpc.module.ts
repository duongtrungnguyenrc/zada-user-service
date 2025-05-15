import { Module } from "@nestjs/common";

import { UserModule } from "~user";

import { UserGrpcController } from "./user-grpc.controller";
import { UserGrpcService } from "./user-grpc.service";

@Module({
  imports: [UserModule],
  providers: [UserGrpcService],
  controllers: [UserGrpcController],
})
export class UserGrpcModule {}
