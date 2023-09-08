import { Args, Context, Mutation, Query, Resolver } from "@nestjs/graphql";
import { Request, Response } from "express";
import { UsersService } from "./users.service";
import { User } from "./models/user.model";
import { UsersArgs } from "./dto/user.args";
import { RegisterUserInput } from "./dto/register.input";
import { LoginUserInput } from "./dto/login.input";
import { UseGuards } from "@nestjs/common";
import { AuthGuard } from "src/guards/auth.guard";
import { UserData } from "src/decorators/user.decorator";
import { UserModifyInput } from "./dto/user_modify.input";

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => [User])
  async getUsers(@Args() usersArgs: UsersArgs): Promise<User[]> {
    return await this.usersService.findAll(usersArgs);
  }
  @Query(() => User)
  @UseGuards(AuthGuard)
  async myData(@UserData() user: { id: number }) {
    return this.usersService.getUserById(user.id);
  }
  @Mutation(() => User)
  async login(
    @Args("data") loginData: LoginUserInput,
    @Context() context: { req: Request; res: Response }
  ): Promise<User> {
    const data = await this.usersService.login(loginData);
    context.res.cookie("token", data.token, { httpOnly: true });
    return data.user;
  }
  @Mutation(() => User)
  @UseGuards(AuthGuard)
  async logout(
    @Context() context: { res: Response },
    @UserData() user: { id: number }
  ) {
    context.res.clearCookie("token");
    return await this.usersService.getUserById(user.id);
  }
  @Mutation(() => User)
  async register(@Args("data") registerData: RegisterUserInput): Promise<User> {
    const user = await this.usersService.register(registerData);
    return user;
  }
  @Mutation(() => User)
  @UseGuards(AuthGuard)
  async modifyUser(
    @Args("data") data: UserModifyInput,
    @UserData() user: { id: number }
  ) {
    return await this.usersService.modify(user.id, data);
  }
  @Mutation(() => User)
  @UseGuards(AuthGuard)
  async changeUserPassword(
    @Args("oldPassword") oldPassword: string,
    @Args("newPassword") newPassword: string,
    @UserData() user: { id: number }
  ) {
    return await this.usersService.newPassword(
      user.id,
      oldPassword,
      newPassword
    );
  }
}
