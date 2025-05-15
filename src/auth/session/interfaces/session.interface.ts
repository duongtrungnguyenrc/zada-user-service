import { UserAgent } from "@duongtrungnguyen/micro-commerce";

import { IUser } from "~user";

export class ISession {
  id: string;
  jit: string;
  user: IUser;
  userAgent: UserAgent;
  ip: string;
  expiresAt: Date | null;
  createdAt: Date;
}
