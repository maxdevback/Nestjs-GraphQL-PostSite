import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { UsersModule } from "./users/users.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "./users/models/user.entity";
import { PostEntity } from "./posts/models/post.entity";
import { PostsModule } from "./posts/posts.module";
import { CommentsModule } from "./comments/comments.module";
import { CommentEntity } from "./comments/models/comment.entity";
import { config } from "./config";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: config.Db.type as "postgres",
      ssl: true,
      synchronize: true,
      url: config.Db.link,
      entities: [UserEntity, PostEntity, CommentEntity],
    }),
    UsersModule,
    PostsModule,
    CommentsModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      context: ({ req, res }) => ({ req, res }),
      driver: ApolloDriver,
      autoSchemaFile: "schema.gql",
      installSubscriptionHandlers: true,
      buildSchemaOptions: {},
      playground: {
        settings: {
          "request.credentials": "include",
        },
      },
    }),
  ],
})
export class AppModule {}
