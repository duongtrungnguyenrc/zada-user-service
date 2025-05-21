import { IUser } from "~user";

import { EActivityTypes, EEntityTypes } from "../enums";

export interface IActivity {
  id: string;
  user: IUser;
  activityType: EActivityTypes;
  entityType: EEntityTypes;
  createdAt: Date;
  details: string;
}
