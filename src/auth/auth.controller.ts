import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  @Post('login')
  @UseGuards(AuthGuard('local'))
  async login(@Req() request) {
    return {
      userId: request.user.id,
      token: 'token here',
    };
  }
}
