import { UseGuards } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';
import { AuthGuardJwtGql } from './auth-guard-jwt.gql';
import { CurrentUser } from './current-user.decorator';
import { User } from './user.entity';

@Resolver(() => User)
export class UserResolver {
  @Query(() => User, { nullable: true })
  @UseGuards(AuthGuardJwtGql)
  public async me(@CurrentUser() user: User): Promise<User> {
    return user;
  }
}
