export interface IUser {
  id: string;
  email: string;
  avatarUrl?: string;
  phoneNumber: string;
  fullName: string;
  createdAt: Date;
  updatedAt: Date;
  isSeller: boolean;
}
