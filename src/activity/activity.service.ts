import { RepositoryService } from "@duongtrungnguyen/micro-commerce";
import { InjectRepository } from "@nestjs/typeorm";
import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";

import { ActivityEntity } from "./entities";

@Injectable()
export class ActivityService extends RepositoryService<ActivityEntity> {
  constructor(@InjectRepository(ActivityEntity) activityRepository: Repository<ActivityEntity>) {
    super(activityRepository);
  }
}
