import { withBaseResponse } from "@duongtrungnguyen/micro-commerce";

import { ProfileVM } from "./profile.vm";

export class ProfileResponseVM extends withBaseResponse(ProfileVM) {}
