import { ApiProperty } from "@nestjs/swagger";

export class UserVM {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty({ required: false })
  avatarUrl?: string;

  @ApiProperty()
  phoneNumber: string;

  @ApiProperty()
  fullName: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  isSeller: boolean;
}
