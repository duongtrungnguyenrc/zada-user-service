import { ApiProperty } from "@nestjs/swagger";

import { ProfileVM } from "./profile.vm";

export class UserVM extends ProfileVM {
  @ApiProperty()
  passwordHash: string;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  isVerified: boolean;
}
