import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}
  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (user && user.password === pass) {
      const payload = { username: user.username, sub: user.id };
      return {
        code: 200,
        data: this.jwtService.sign(payload),
        msg: '登录成功',
        success: true,
        // access_token: this.jwtService.sign(payload),
      };
    }
    return {
      code: 200,
      data: null,
      msg: '用户名或密码错误',
      success: false,
    };
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
