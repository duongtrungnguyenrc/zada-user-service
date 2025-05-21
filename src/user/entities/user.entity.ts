import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

import { AddressEntity, IAddress } from "~address";

import { IUser } from "../interfaces";

@Entity("users")
export class UserEntity implements IUser {
  @PrimaryGeneratedColumn("identity")
  id: string;

  @Column({ unique: true, length: 255 })
  email: string;

  @Column({ name: "avatar_url", length: 255, nullable: true })
  avatarUrl?: string;

  @Column({ name: "phone_number", length: 20, unique: true })
  phoneNumber: string;

  @Column({ name: "full_name", length: 255 })
  fullName: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  @Column({ name: "seller", default: false })
  isSeller: boolean;

  @OneToMany(() => AddressEntity, (address) => address.user, { onDelete: "CASCADE" })
  addresses: IAddress[];
}
