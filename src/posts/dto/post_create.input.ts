import { Field, InputType } from "@nestjs/graphql";
import { MaxLength, MinLength } from "class-validator";

@InputType()
export class PostCreateInput {
  @Field()
  @MinLength(8)
  @MaxLength(60)
  title: string;

  @Field()
  @MinLength(50)
  body: string;
}
