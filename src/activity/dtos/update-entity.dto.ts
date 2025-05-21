import { IsEnum, IsOptional, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

import { EActivityTypes, EEntityTypes } from "../enums";

export class UpdateActivityDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  userId?: string;

  @ApiProperty({ required: false })
  @IsEnum(EActivityTypes)
  @IsOptional()
  activityType?: EActivityTypes;

  @ApiProperty({ required: false })
  @IsEnum(EEntityTypes)
  @IsOptional()
  entityType?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  details?: string;
}
