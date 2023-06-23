import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginInput } from './dto/login.input';
import { TokenOutput } from './dto/token.output';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => TokenOutput, { name: 'login' })
  public async login(
    @Args('input', { type: () => LoginInput })
    input: LoginInput,
  ): Promise<TokenOutput> {
    const token = this.authService.getTokenForUser(
      await this.authService.validateUser(input.username, input.password),
    );

    return new TokenOutput({
      token,
    });
  }
}
