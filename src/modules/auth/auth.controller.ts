import { Controller, Post, Get, Body, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard.js';
import { AuthRequest } from '../../auth/auth.types.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('google') 
  async loginWithGoogle(@Body() body: { token: string }) {
      const { token } = body;
      if (!token) {
          throw new Error('ID Token do Google não fornecido');
      }

      const decoded = await this.authService.decodeGoogleToken(token);
      if (!decoded || !decoded.email) {
          throw new Error('Usuário inválido ou sem e-mail');
      }

      const user = await this.authService.validateOrCreateUser({
          email: decoded.email,
          name: decoded.name ?? 'Usuário sem nome',
          picture: decoded.picture ?? '',
      });

      const jwt = await this.authService.generateJwt(user);

      return { token: jwt };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Req() req: AuthRequest) {
    return req.user;
  }
}
