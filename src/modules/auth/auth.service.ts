import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt'; 
import { PrismaService } from '../../prisma/prisma.service.js';
import axios from 'axios';
import { Role } from '../../auth/role.enum.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService
) {}

  async decodeGoogleToken(idToken: string) {
    try {
      const { data } = await axios.get(`https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`);
      return data;
    } catch (error) {
      console.error("Erro ao validar ID Token do Google:", error);
      return null;
    }
  }

  async validateOrCreateUser(profile: { email: string; name: string; picture: string }) {
    let user = await this.prisma.user.findUnique({
      where: { email: profile.email },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email: profile.email,
          name: profile.name ?? 'Usuário sem nome',
          image: profile.picture ?? '',
          role: Role.MEMBER,
        },
      });
    }

    return {
      id: user.id,
      email: user.email ?? '',
      role: user.role as Role,
    };
  }

  async generateJwt(user: { id: string; email: string; role: Role }) {
    return this.jwtService.sign(
      { id: user.id, email: user.email, role: user.role },
      { secret: process.env.JWT_SECRET, expiresIn: '1d' }
    );
  }
}
