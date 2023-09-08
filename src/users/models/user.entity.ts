import { CommentEntity } from "src/comments/models/comment.entity";
import { PostEntity } from "src/posts/models/post.entity";
import { PrimaryGeneratedColumn, Column, Entity, OneToMany } from "typeorm";

@Entity("user")
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  username: string;

  @Column({ nullable: false })
  email: string;

  @Column({ nullable: false })
  creation_Date: Date;

  @Column({ nullable: false })
  password: string;

  @OneToMany(() => PostEntity, (post) => post.author, {
    onDelete: "CASCADE",
    nullable: false,
  })
  posts: PostEntity[];

  @OneToMany(() => CommentEntity, (comment) => comment.author, {
    onDelete: "CASCADE",
    nullable: false,
  })
  comments: CommentEntity[];
}
