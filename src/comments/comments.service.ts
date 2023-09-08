import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { CommentEntity } from "./models/comment.entity";
import { PostEntity } from "src/posts/models/post.entity";
import { UserEntity } from "src/users/models/user.entity";
import { CommentModifyInput } from "./dto/comment_modify.input";
import { CommentsArgs } from "./dto/comments.args";

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(CommentEntity)
    private readonly commentRepo: Repository<CommentEntity>
  ) {}

  async create(
    post: PostEntity,
    author: UserEntity,
    data: { title: string; body: string; isPositive: boolean }
  ) {
    const newComment = new CommentEntity();
    Object.assign(newComment, data);
    (newComment.post = post), (newComment.author = author);
    newComment.creation_Date = new Date();
    return await this.commentRepo.save(newComment);
  }
  async getById(id: number) {
    console.log("here");
    return await this.commentRepo.findOne({
      where: { id },
      relations: ["author", "post"],
    });
  }
  async getAll(args: CommentsArgs) {
    return await this.commentRepo.find({
      relations: ["author", "post"],
      skip: args.skip,
      take: args.take,
    });
  }
  async modify(commentId: number, userId: number, data: CommentModifyInput) {
    const comment = await this.commentRepo.findOne({
      where: { id: commentId },
      relations: ["author", "post"],
    });
    if (!comment)
      throw new NotFoundException("Comment with that id doesn't exists");
    if (comment.author.id !== userId)
      throw new ForbiddenException("You're not owner of this comment");
    Object.assign(comment, data);
    return await this.commentRepo.save(comment);
  }
  async delete(commentId: number, userId: number) {
    const comment = await this.commentRepo.findOne({
      where: { id: commentId },
      relations: ["post", "author"],
    });
    if (!comment)
      throw new NotFoundException("Comment with that id doesn't exists");
    if (comment.author.id !== userId)
      throw new ForbiddenException("You're not owner of that comment");
    await this.commentRepo.remove(comment);
    comment.id = commentId;
    return comment;
  }
}
