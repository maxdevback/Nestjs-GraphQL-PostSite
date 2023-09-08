import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Comment } from "../../comments/models/comment.model";
import { Post } from "../../posts/models/post.model";

@ObjectType({ description: "user" })
export class User {
  @Field(() => ID)
  id: number;

  @Field()
  username: string;

  @Field()
  email: string;

  @Field()
  creation_Date: number;

  @Field()
  comments: Comment[];

  @Field()
  posts: Post[];
}
