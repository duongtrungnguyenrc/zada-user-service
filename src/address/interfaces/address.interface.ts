import { IUser } from "~user";

export interface IAddress {
  id: string;
  user: IUser;
  recipientName: string;
  recipientEmail: string;
  phoneNumber: string;
  street: string;
  city: string;
  district: string;
  country: string;
  postalCode: string;
  isDefault: boolean;
}
