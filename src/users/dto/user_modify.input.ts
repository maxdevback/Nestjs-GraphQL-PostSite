import { InputType, Field } from "@nestjs/graphql";
import { IsEmail, IsOptional } from "class-validator";

@InputType()
export class UserModifyInput {
  @Field()
  username?: string;

  @Field()
  @IsOptional()
  @IsEmail()
  email?: string;
}
