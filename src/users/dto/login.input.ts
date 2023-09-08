import { Field, InputType } from "@nestjs/graphql";
import { MaxLength, MinLength } from "class-validator";

@InputType()
export class LoginUserInput {
  @Field()
  @MinLength(8)
  @MaxLength(30)
  username: string;

  @Field()
  @MinLength(8)
  password: string;
}
