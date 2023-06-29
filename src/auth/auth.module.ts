import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';
import { User } from './user.entity';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { UsersController } from './users.controller';
import { UserDoesNotExistConstraint } from './validation/user-does-not-exist.constraint';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.AUTH_SECRET,
        signOptions: {
          expiresIn: '60m',
        },
      }),
    }),
  ],
  controllers: [AuthController, UsersController],
  providers: [
    LocalStrategy,
    JwtStrategy,
    AuthService,
    AuthResolver,
    UserResolver,
    UserService,
    UserDoesNotExistConstraint,
  ],
})
export class AuthModule {}
