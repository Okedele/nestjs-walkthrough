import { Body, Controller, HttpException, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('register')
  async createUser(@Body() user: UserRegisterDto): Promise<any> {
    try {
      const newUser = await this.authService.registerUser(user);
      delete newUser.password;
      return {
        status: 'success',
        message: 'User created successfully',
        data: newUser,
      };
    } catch (error) {
      throw new HttpException(`Registration error: ${error.message}`, 500);
    }
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto): Promise<any> {
    try {
      const jwt = await this.authService.login(loginUserDto);
      return {
        status: 'success',
        message: 'Login successful',
        data: { jwt },
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(`Login error: ${error.message}`, 500);
    }
  }
}
