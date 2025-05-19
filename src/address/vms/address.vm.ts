import { ApiProperty } from "@nestjs/swagger";

import { IUser, UserVM } from "~user";

export class AddressVM {
  @ApiProperty({ format: "uuid" })
  id: string;

  @ApiProperty({
    type: () => UserVM,
    example: {
      id: "",
      fullName: "",
      avatarUrl: "",
    },
  })
  user: IUser;

  @ApiProperty()
  recipientName: string;

  @ApiProperty()
  recipientEmail: string;

  @ApiProperty()
  phoneNumber: string;

  @ApiProperty()
  street: string;

  @ApiProperty()
  city: string;

  @ApiProperty()
  district: string;

  @ApiProperty()
  country: string;

  @ApiProperty()
  postalCode: string;

  @ApiProperty()
  isDefault: boolean;
}
