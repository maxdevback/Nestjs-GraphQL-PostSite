import { Field, InputType } from "@nestjs/graphql";
import { MaxLength, IsEmail, MinLength } from "class-validator";

@InputType()
export class RegisterUserInput {
  @Field()
  @MinLength(8)
  @MaxLength(30)
  username: string;

  @Field()
  @MinLength(8)
  password: string;

  @Field()
  @IsEmail()
  email: string;
}
