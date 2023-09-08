import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PostEntity } from "./models/post.entity";
import { UserEntity } from "src/users/models/user.entity";
import { PostCreateInput } from "./dto/post_create.input";
import { PostsArgs } from "./dto/posts.args";

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepo: Repository<PostEntity>
  ) {}

  async getById(id: number) {
    const post = await this.postRepo.findOne({
      where: { id },
      relations: ["author", "comments"],
    });
    if (!post) throw new NotFoundException("Post with that id doesn't exist");
    delete post.author.password;
    return post;
  }
  async getPosts(args: PostsArgs) {
    const posts = await this.postRepo.find({
      relations: ["author", "comments"],
      skip: args.skip,
      take: args.skip,
    });
    return posts;
  }
  async create(author: UserEntity, data: PostCreateInput) {
    const post = this.postRepo.create();
    post.body = data.body;
    post.title = data.title;
    post.author = author;
    post.creation_Data = new Date();
    return await this.postRepo.save(post);
  }
  async deleteById(postId: number, userId: number) {
    const post = await this.postRepo.findOne({
      where: { id: postId },
      relations: ["author", "comments"],
    });
    if (!post) throw new NotFoundException("Post with that id doesn't exist");
    if (post.author.id !== userId)
      throw new ForbiddenException("You're not owner of this post");
    await this.postRepo.remove(post);
    post.id = postId;
    return post;
  }
  async modify(
    postId: number,
    authorId: number,
    data: { title?: string; body?: string }
  ) {
    const post = await this.postRepo.findOne({
      where: { id: postId },
      relations: ["author", "comments"],
    });
    if (!post) throw new NotFoundException("Post with that id does not exists");
    if (post.author.id !== authorId)
      throw new ForbiddenException("You're not owner of this post");
    post.update_Data = new Date();
    Object.assign(post, data);
    return await this.postRepo.save(post);
  }
}
