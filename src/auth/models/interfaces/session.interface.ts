import { UserAgent } from "@duongtrungnguyen/micro-commerce";

import { IUser } from "~user";

export class ISession {
  id: string;
  jit: string;
  user: IUser;
  userAgent: UserAgent;
  ip: string;
  createdAt: Date;
  expiresAt: Date | null;
}
