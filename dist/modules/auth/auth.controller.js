var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Controller, Post, Get, Body, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard.js';
let AuthController = class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    async loginWithGoogle(body) {
        const { token } = body;
        if (!token) {
            throw new Error('ID Token do Google não fornecido');
        }
        console.log("ID Token recebido:", token); 
        // Decodificar o ID Token do Google
        const decoded = await this.authService.decodeGoogleToken(token);
        if (!decoded || !decoded.email) {
            throw new Error('Usuário inválido ou sem e-mail');
        }
        console.log("Usuário decodificado:", decoded); 
        // Criar usuário no banco se não existir
        const user = await this.authService.validateOrCreateUser({
            email: decoded.email,
            name: decoded.name ?? 'Usuário sem nome',
            picture: decoded.picture ?? '',
        });
        // Gerar JWT do backend
        const jwt = await this.authService.generateJwt(user);
        console.log("Token JWT gerado:", jwt); 
        return { token: jwt };
    }
    async getProfile(req) {
        return req.user;
    }
};
__decorate([
    Post('google') // ⬅️ Agora aceita um POST com o ID Token do Google
    ,
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "loginWithGoogle", null);
__decorate([
    Get('me'),
    UseGuards(JwtAuthGuard),
    __param(0, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getProfile", null);
AuthController = __decorate([
    Controller('auth'),
    __metadata("design:paramtypes", [AuthService])
], AuthController);
export { AuthController };
//# sourceMappingURL=auth.controller.js.map