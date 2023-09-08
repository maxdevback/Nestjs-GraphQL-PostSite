import { ObjectType, Field, Int } from "@nestjs/graphql";
import { Post } from "src/posts/models/post.model";
import { User } from "src/users/models/user.model";

@ObjectType()
export class Comment {
  @Field(() => Int)
  id: number;
  @Field()
  title: string;

  @Field()
  body: string;

  @Field()
  isPositive: boolean;

  @Field()
  creation_Date: Date;

  @Field()
  author: User;

  @Field()
  post: Post;
}
