import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";

import { ActivityController } from "./activity.controller";
import { ActivityService } from "./activity.service";
import { ActivityEntity } from "./entities";

@Module({
  imports: [TypeOrmModule.forFeature([ActivityEntity])],
  providers: [ActivityService],
  controllers: [ActivityController],
})
export class ActivityModule {}
