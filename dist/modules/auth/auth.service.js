var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service.js';
import axios from 'axios';
import { Role } from '../../auth/role.enum.js';
let AuthService = class AuthService {
    jwtService;
    prisma;
    constructor(jwtService, prisma) {
        this.jwtService = jwtService;
        this.prisma = prisma;
    }
    // 🔥 Decodifica o ID Token do Google e retorna os dados do usuário
    async decodeGoogleToken(idToken) {
        try {
            const { data } = await axios.get(`https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`);
            return data;
        }
        catch (error) {
            console.error("Erro ao validar ID Token do Google:", error);
            return null;
        }
    }
    async validateOrCreateUser(profile) {
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
            role: user.role,
        };
    }
    async generateJwt(user) {
        return this.jwtService.sign({ id: user.id, email: user.email, role: user.role }, { secret: process.env.JWT_SECRET, expiresIn: '1d' });
    }
};
AuthService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [JwtService,
        PrismaService])
], AuthService);
export { AuthService };
//# sourceMappingURL=auth.service.js.map