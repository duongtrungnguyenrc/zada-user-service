import { ApiProperty } from "@nestjs/swagger";

import { UpdateUserDto } from "./update-user.dto";

export class UpdateUserAsyncDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ type: UpdateUserDto })
  updates: UpdateUserDto;
}
