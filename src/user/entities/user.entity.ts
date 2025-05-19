import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

import { AddressEntity, IAddress } from "~address";

import { IUser } from "../interfaces";

@Entity("user")
export class UserEntity implements IUser {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  avatarUrl?: string;

  @Column()
  passwordHash: string;

  @Column({ unique: true })
  phoneNumber: string;

  @Column()
  fullName: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ default: false })
  isSeller: boolean;

  @OneToMany(() => AddressEntity, (address) => address.user, { onDelete: "CASCADE" })
  addresses: IAddress[];
}
