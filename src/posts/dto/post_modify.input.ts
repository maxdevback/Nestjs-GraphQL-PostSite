import { InputType, Field } from "@nestjs/graphql";
import { IsOptional, MinLength, MaxLength } from "class-validator";

@InputType()
export class PostModifyInput {
  @Field()
  @IsOptional()
  @MinLength(8)
  @MaxLength(60)
  title?: string;

  @Field()
  @IsOptional()
  @MinLength(50)
  body?: string;
}
