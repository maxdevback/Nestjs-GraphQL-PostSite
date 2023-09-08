import {
  Injectable,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { sign, verify } from "jsonwebtoken";
import { UsersArgs } from "./dto/user.args";
import { User } from "./models/user.model";
import { UserEntity } from "./models/user.entity";
import { RegisterUserInput } from "./dto/register.input";
import { LoginUserInput } from "./dto/login.input";
import { UserModifyInput } from "./dto/user_modify.input";
import { compare, hash } from "bcrypt";
import { config } from "src/config";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>
  ) {}
  async register(data: RegisterUserInput): Promise<User> {
    const userWithThatEmail = await this.userRepo.findOne({
      where: { email: data.email },
    });
    if (userWithThatEmail)
      throw new ConflictException("User with that email already exists");
    const userWithThatUsername = await this.userRepo.findOne({
      where: { username: data.username },
    });
    if (userWithThatUsername)
      throw new ConflictException("User with that username already exists");
    data.password = await hash(data.password, 10);
    const newUser = this.userRepo.create(data);

    newUser.creation_Date = new Date();
    return (await this.userRepo.save(newUser)) as unknown as User;
  }
  async login(data: LoginUserInput): Promise<{ user: User; token: string }> {
    const userWithThatUsername = await this.userRepo.findOne({
      where: { username: data.username },
    });
    if (!userWithThatUsername)
      throw new NotFoundException("User with that username doesn't exist");
    if (await compare(data.password, userWithThatUsername.password))
      throw new ConflictException("Password is wrong");
    const token = sign(
      {
        username: data.username,
        id: userWithThatUsername.id,
      },
      config.tokenSecret
    );
    return { user: userWithThatUsername as unknown as User, token };
  }
  async getUserById(id: number): Promise<User> {
    const user = await this.userRepo.findOne({
      where: { id },
      relations: ["posts", "comments"],
    });
    if (!user) throw new NotFoundException("User with that id does not found");
    return user as unknown as User;
  }
  async findAll(usersArgs: UsersArgs): Promise<User[]> {
    return (await this.userRepo.find({
      skip: usersArgs.skip,
      take: usersArgs.take,
      relations: ["comments", "posts"],
    })) as unknown as User[];
  }
  async newPassword(userId: number, oldPassword: string, newPassword: string) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ["comments", "posts"],
    });
    if (!user) throw new NotFoundException("Something went wrong");
    if (await compare(oldPassword, user.password))
      throw new ConflictException("The password is wrong");
    user.password = newPassword;
    return (await this.userRepo.save(user)) as unknown as User;
  }
  async modify(userId: number, data: UserModifyInput) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ["posts", "comments"],
    });
    if (!user) throw new NotFoundException("Something went wrong");
    Object.assign(user, data);
    return (await this.userRepo.save(user)) as unknown as User;
  }
  async delete(userId: number) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ["posts", "comments"],
    });
    if (!user) throw new NotFoundException("User already deleted");
    await this.userRepo.remove(user);
    user.id = userId;
    return user as unknown as User;
  }
}
