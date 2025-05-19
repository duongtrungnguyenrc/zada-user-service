import { ApiProperty } from "@nestjs/swagger";

export class ProfileVM {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  avatarUrl?: string;

  @ApiProperty()
  phoneNumber: string;

  @ApiProperty()
  fullName: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
