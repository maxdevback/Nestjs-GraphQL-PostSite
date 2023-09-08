import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { PostsService } from "./posts.service";
import { Post } from "./models/post.model";
import { UseGuards } from "@nestjs/common";
import { AuthGuard } from "src/guards/auth.guard";
import { UserData } from "src/decorators/user.decorator";
import { PostCreateInput } from "./dto/post_create.input";
import { UsersService } from "src/users/users.service";
import { UserEntity } from "src/users/models/user.entity";
import { PostModifyInput } from "./dto/post_modify.input";
import { PostEntity } from "./models/post.entity";
import { PostsArgs } from "./dto/posts.args";

@Resolver()
export class PostsResolver {
  constructor(
    private readonly postsService: PostsService,
    private readonly usersService: UsersService
  ) {}

  @Query(() => Post)
  async getPostById(@Args("id") id: number): Promise<PostEntity> {
    return await this.postsService.getById(id);
  }
  @Query(() => [Post])
  async getPosts(@Args() postsArgs: PostsArgs): Promise<Post[]> {
    return (await this.postsService.getPosts(postsArgs)) as unknown as [Post];
  }

  @Mutation(() => Post)
  @UseGuards(AuthGuard)
  async createPost(
    @Args("data") data: PostCreateInput,
    @UserData() userData: { id: number }
  ): Promise<Post> {
    const user = (await this.usersService.getUserById(
      userData.id
    )) as unknown as UserEntity;

    return (await this.postsService.create(user, data)) as unknown as Post;
  }
  @Mutation(() => Post)
  @UseGuards(AuthGuard)
  async deletePost(
    @Args("id") id: number,
    @UserData() userData: { id: number }
  ) {
    return await this.postsService.deleteById(id, userData.id);
  }
  @Mutation(() => Post)
  @UseGuards(AuthGuard)
  async modifyPost(
    @Args("id") id: number,
    @Args("data") data: PostModifyInput,
    @UserData() user: { id: number }
  ) {
    return await this.postsService.modify(id, user.id, data);
  }
}
