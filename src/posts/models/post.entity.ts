import { CommentEntity } from "src/comments/models/comment.entity";
import { UserEntity } from "src/users/models/user.entity";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from "typeorm";

@Entity({ name: "post" })
export class PostEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, unique: true })
  title: string;

  @Column({ nullable: false, unique: true })
  body: string;

  @Column({ nullable: false })
  creation_Data: Date;

  @Column({ nullable: true })
  update_Data: Date;

  @ManyToOne(() => UserEntity, (user) => user.id, {
    nullable: false,
    onDelete: "CASCADE",
  })
  author: UserEntity;

  @OneToMany(() => CommentEntity, (comment) => comment.post, {
    onDelete: "CASCADE",
  })
  comments: CommentEntity[];
}
