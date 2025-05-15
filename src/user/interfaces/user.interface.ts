export interface IUser {
  id: string;
  email: string;
  avatarUrl?: string;
  passwordHash: string;
  phoneNumber: string;
  fullName: string;
  createdAt: Date;
  updatedAt: Date;
  isVerified: boolean;
  isActive: boolean;
}
