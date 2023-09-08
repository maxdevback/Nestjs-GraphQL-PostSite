import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersResolver } from "./users.resolver";
import { UsersService } from "./users.service";
import { UserEntity } from "./models/user.entity";
import { PostEntity } from "src/posts/models/post.entity";

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, PostEntity])],
  providers: [UsersResolver, UsersService],
})
export class UsersModule {}
