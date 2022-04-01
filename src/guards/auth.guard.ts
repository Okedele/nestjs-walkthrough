import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const header = request.headers['authorization'];
      if (!header) {
        throw new HttpException(
          'Please add authorization token to the header',
          401,
        );
      }
      const token = this.getToken(header);

      if (!token) throw new HttpException('Auth token is invalid', 401);

      const jwt_verify = this.jwtService.verify(token, {
        secret: process.env.JWT_KEY,
      });
      request.userId = jwt_verify.userId;

      return true;
    } catch (error) {
      throw new HttpException(error.message, 401);
    }
  }

  getToken(token) {
    const parts = token.split(' ');
    if (parts.length < 2 || parts[0].toLowerCase() !== 'bearer' || !parts[1])
      return null;

    return parts[1];
  }
}
