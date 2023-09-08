import { ObjectType, Field, ID } from "@nestjs/graphql";
import { User } from "src/users/models/user.model";
import { Comment } from "src/comments/models/comment.model";

@ObjectType()
export class Post {
  @Field(() => ID)
  id: number;

  @Field()
  title: string;

  @Field()
  body: string;

  @Field()
  creation_Data: number;

  @Field()
  update_Data: number;

  @Field()
  author: User;

  @Field()
  comments: Comment[];
}
