import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

import { EActivityTypes, EEntityTypes } from "../enums";

export class CreateActivityDto {
  @ApiProperty()
  @IsEnum(EActivityTypes)
  activityType: EActivityTypes;

  @ApiProperty()
  @IsEnum(EEntityTypes)
  entityType: EEntityTypes;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  details: string;
}
