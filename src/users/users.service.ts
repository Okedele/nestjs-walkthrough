import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../database/entities/user.entity';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRegisterDto } from '../auth/dto/user-register.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  getUserByEmail(value: string): Promise<User | undefined> {
    const user = this.userRepository.findOne({
      where: [{ email: value }],
    });
    return user;
  }

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

  async showAll() {
    const users = await this.userRepository.find();
    return users;
  }

  async findById(id: number) {
    const user = await this.userRepository.findOne({
      where: { id: id },
    });
    if (!user) throw new HttpException('User does not exist', 404);
    return user;
  }

  async update(id: number, data: UpdateUserDto) {
    const user = await this.userRepository.findOne({
      where: { id: id },
    });
    if (!user) throw new HttpException('User does not exist', 404);
    await this.userRepository.update({ id }, data);
    return;
  }

  async destroy(id: number) {
    await this.userRepository.delete({ id });
    return;
  }
}
