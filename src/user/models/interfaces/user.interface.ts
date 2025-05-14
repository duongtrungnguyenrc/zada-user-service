export interface IUser {
  id: string;
  email: string;
  avatarUrl?: string;
  passwordHash: string;
  phoneNumber: string;
  fullName: string;
  createdAt: string;
  updatedAt: string;
  isEmailVerified: boolean;
  isActive: boolean;
}
