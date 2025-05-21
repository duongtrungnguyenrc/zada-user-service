import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { IUser, UserEntity } from "~user";

import { IAddress } from "../interfaces";

@Entity("addresses")
export class AddressEntity implements IAddress {
  @PrimaryGeneratedColumn("identity")
  id: string;

  @ManyToOne(() => UserEntity, (user) => user.addresses)
  user: IUser;

  @Column({ name: "recipient_name", length: 255 })
  recipientName: string;

  @Column({ name: "recipient_email", length: 255 })
  recipientEmail: string;

  @Column({ name: "phone_number", length: 20 })
  phoneNumber: string;

  @Column({ length: 255 })
  street: string;

  @Column({ length: 255 })
  city: string;

  @Column({ length: 255 })
  district: string;

  @Column({ length: 255 })
  country: string;

  @Column({ name: "postal_code", length: 20 })
  postalCode: string;

  @Column({ name: "is_default" })
  isDefault: boolean;
}
