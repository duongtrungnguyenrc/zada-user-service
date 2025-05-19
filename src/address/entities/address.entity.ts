import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { IUser, UserEntity } from "~user";

import { IAddress } from "../interfaces";

@Entity("address")
export class AddressEntity implements IAddress {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => UserEntity, (user) => user.addresses)
  user: IUser;

  @Column()
  recipientName: string;

  @Column()
  recipientEmail: string;

  @Column()
  phoneNumber: string;

  @Column()
  street: string;

  @Column()
  city: string;

  @Column()
  district: string;

  @Column()
  country: string;

  @Column()
  postalCode: string;

  @Column()
  isDefault: boolean;
}
