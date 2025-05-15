import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { UserAgent } from "@duongtrungnguyen/micro-commerce";

import { IUser, UserEntity } from "~user";

import { ISession } from "../interfaces";

@Entity("session")
export class SessionEntity implements ISession {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  jit: string;

  @ManyToOne(() => UserEntity)
  user: IUser;

  @Column({ type: "jsonb" })
  userAgent: UserAgent;

  @Column()
  ip: string;

  @Column({ nullable: true })
  expiresAt: Date | null;

  @CreateDateColumn()
  createdAt: Date;
}
