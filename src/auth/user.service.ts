import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create.user.dto';
import { User } from './user.entity';

export class UserService {
  constructor(
    private readonly authService: AuthService,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  public async create(createUserDto: CreateUserDto): Promise<User> {
    const user = new User({
      ...createUserDto,
      password: await this.authService.hashPassword(createUserDto.password),
    });

    return await this.userRepository.save(user);
  }
}
