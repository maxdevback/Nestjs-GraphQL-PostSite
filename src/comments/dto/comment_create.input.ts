import { InputType, Field } from "@nestjs/graphql";
import { minLength, maxLength } from "class-validator";

@InputType()
export class CommentCreateInput {
  @Field()
  title: string;

  @Field()
  body: string;

  @Field()
  isPositive: boolean;
}
