import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}
  @Get()
  @UseGuards(AuthGuard)
  async showAllUsers(): Promise<any> {
    try {
      const users = await this.userService.showAll();
      return {
        status: 'success',
        message: 'Users retrieved successfully',
        data: users,
      };
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async getUser(@Param('id') id: number): Promise<any> {
    try {
      const user = await this.userService.findById(id);
      return {
        status: 'success',
        message: 'User info retrieved successfully',
        data: user,
      };
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  async updateUser(
    @Param('id') id: number,
    @Body() data: UpdateUserDto,
  ): Promise<any> {
    try {
      await this.userService.update(id, data);
      return {
        status: 'success',
        message: 'User updated successfully',
      };
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async deleteUser(@Param('id') id: number): Promise<any> {
    try {
      await this.userService.destroy(id);
      return {
        status: 'success',
        message: 'User deleted successfully',
      };
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }
}
