import { HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../database/entities/user.entity';
import { UsersService } from '../users/users.service';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRegisterDto } from './dto/user-register.dto';
import { LoginUserDto } from './dto/user-login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async registerUser(user: UserRegisterDto): Promise<User> {
    const passwordHash = await bcrypt.hash(
      user.password,
      Number(process.env.SALT_ROUNDS),
    );
    const new_user = this.userRepository.create({
      firstName: user.firstName,
      lastName: user.lastName,
      otherName: user.otherName,
      email: user.email,
      phone: user.phone,
      password: passwordHash,
    });

    return this.userRepository.save(new_user);
  }

  async login(loginDto: LoginUserDto): Promise<any> {
    const user = await this.usersService.getUserByEmail(loginDto.email);

    if (!user) throw new HttpException('Invalid credentials', 401);

    const isValid = await bcrypt.compare(loginDto.password, user.password);

    if (!isValid) throw new HttpException('Invalid credentials', 401);

    const token = this.jwtService.sign({ userId: user.id });

    return token;
  }
}
