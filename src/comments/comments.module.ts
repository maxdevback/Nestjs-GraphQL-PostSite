import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CommentEntity } from "./models/comment.entity";
import { CommentsService } from "./comments.service";
import { CommentsResolver } from "./comments.resolver";
import { PostEntity } from "src/posts/models/post.entity";
import { UserEntity } from "src/users/models/user.entity";
import { PostsService } from "src/posts/posts.service";
import { UsersService } from "src/users/users.service";

@Module({
  imports: [TypeOrmModule.forFeature([CommentEntity, PostEntity, UserEntity])],
  providers: [CommentsService, PostsService, UsersService, CommentsResolver],
})
export class CommentsModule {}
