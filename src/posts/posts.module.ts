import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PostEntity } from "./models/post.entity";
import { UserEntity } from "src/users/models/user.entity";
import { PostsService } from "./posts.service";
import { PostsResolver } from "./posts.resolver";
import { UsersService } from "src/users/users.service";

@Module({
  imports: [TypeOrmModule.forFeature([PostEntity, UserEntity])],
  providers: [PostsService, PostsResolver, UsersService],
})
export class PostsModule {}
