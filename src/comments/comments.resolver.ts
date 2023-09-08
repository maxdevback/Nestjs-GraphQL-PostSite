import { Resolver, Mutation, Query, Args } from "@nestjs/graphql";
import { Comment } from "./models/comment.model";
import { UsersService } from "src/users/users.service";
import { PostsService } from "src/posts/posts.service";
import { CommentsService } from "./comments.service";
import { AuthGuard } from "src/guards/auth.guard";
import { UseGuards } from "@nestjs/common";
import { CommentCreateInput } from "./dto/comment_create.input";
import { UserData } from "src/decorators/user.decorator";
import { UserEntity } from "src/users/models/user.entity";
import { CommentModifyInput } from "./dto/comment_modify.input";
import { CommentsArgs } from "./dto/comments.args";

@Resolver("comment")
export class CommentsResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly postsService: PostsService,
    private readonly commentsService: CommentsService
  ) {}
  @Query(() => Comment)
  async getCommentById(@Args("id") id: number) {
    return this.commentsService.getById(id);
  }
  @Query(() => [Comment])
  async getComments(@Args() commentsArgs: CommentsArgs) {
    return await this.commentsService.getAll(commentsArgs);
  }

  @Mutation(() => Comment)
  @UseGuards(AuthGuard)
  async createComment(
    @Args("postId") postId: number,
    @Args("data") data: CommentCreateInput,
    @UserData() userData: { id: number }
  ): Promise<Comment> {
    const user = (await this.usersService.getUserById(
      userData.id
    )) as unknown as UserEntity;
    const post = await this.postsService.getById(postId);
    const comment = (await this.commentsService.create(
      post,
      user,
      data
    )) as unknown as Comment;
    console.log(comment);
    return comment;
  }
  @Mutation(() => Comment)
  @UseGuards(AuthGuard)
  async modifyComment(
    @Args("id") commentId: number,
    @Args("data") data: CommentModifyInput,
    @UserData() user: { id: number }
  ) {
    return await this.commentsService.modify(commentId, user.id, data);
  }
  @Mutation(() => Comment)
  @UseGuards(AuthGuard)
  async deleteComment(
    @Args("commentId") commentId: number,
    @UserData() userData: { id: number }
  ) {
    return await this.commentsService.delete(commentId, userData.id);
  }
}
