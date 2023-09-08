import { InputType, Field } from "@nestjs/graphql";
import { MinLength, MaxLength } from "class-validator";

@InputType()
export class CommentModifyInput {
  @Field()
  title?: string;

  @Field()
  body?: string;
}
