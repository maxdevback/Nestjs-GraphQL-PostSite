import { PostEntity } from "src/posts/models/post.entity";
import { UserEntity } from "src/users/models/user.entity";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";

@Entity({ name: "comment" })
export class CommentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  title: string;

  @Column({ nullable: false })
  body: string;

  @Column({ nullable: false })
  isPositive: boolean;

  @Column()
  creation_Date: Date;

  @ManyToOne(() => UserEntity, (author) => author.id, {
    onDelete: "CASCADE",
  })
  author: UserEntity;

  @ManyToOne(() => PostEntity, (post) => post.id, {
    onDelete: "CASCADE",
  })
  post: PostEntity;
}
