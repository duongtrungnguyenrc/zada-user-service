import { ApiProperty } from "@nestjs/swagger";

import { IUser } from "~user";

import { EActivityTypes, EEntityTypes } from "../enums";

export class ActivityVM {
  @ApiProperty()
  id: string;

  @ApiProperty()
  user: IUser;

  @ApiProperty()
  activityType: EActivityTypes;

  @ApiProperty()
  entityType: EEntityTypes;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  details: string;
}
