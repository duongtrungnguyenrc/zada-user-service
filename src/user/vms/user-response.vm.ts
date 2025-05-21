import { withBaseResponse } from "@duongtrungnguyen/micro-commerce";

import { UserVM } from "./user.vm";

export class UserResponseVM extends withBaseResponse(UserVM) {}
