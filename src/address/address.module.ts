import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";

import { AddressController } from "./address.controller";
import { AddressService } from "./address.service";
import { AddressEntity } from "./entities";

@Module({
  imports: [TypeOrmModule.forFeature([AddressEntity])],
  providers: [AddressService],
  controllers: [AddressController],
})
export class AddressModule {}
