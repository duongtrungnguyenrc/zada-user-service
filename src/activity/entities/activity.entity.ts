import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { IUser, UserEntity } from "~user";

import { EActivityTypes, EEntityTypes } from "../enums";
import { IActivity } from "../interfaces";

@Entity("activities")
export class ActivityEntity implements IActivity {
  @PrimaryGeneratedColumn("identity")
  id: string;

  @ManyToOne(() => UserEntity, (user) => user.activities)
  user: IUser;

  @Column({ name: "activity_type", enum: EActivityTypes })
  activityType: EActivityTypes;

  @Column({ name: "entity_type", enum: EEntityTypes })
  entityType: EEntityTypes;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @Column({ length: 255 })
  details: string;
}
