import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
export class UserRegisterDto {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsOptional()
  @IsString()
  otherName?: string;

  @IsEmail()
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsString()
  phone: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
