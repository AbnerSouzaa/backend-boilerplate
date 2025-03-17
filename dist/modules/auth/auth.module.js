var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthMiddleware } from '../../auth/jwt-auth.middleware.js';
import { RolesGuard } from '../../auth/roles.guard.js';
import { ConfigModule, ConfigService } from '@nestjs/config';
let AuthModule = class AuthModule {
};
AuthModule = __decorate([
    Module({
        imports: [
            ConfigModule,
            JwtModule.registerAsync({
                imports: [ConfigModule],
                inject: [ConfigService],
                useFactory: async (configService) => ({
                    secret: configService.get('JWT_SECRET'),
                    signOptions: { expiresIn: '1d' },
                }),
            }),
        ],
        controllers: [AuthController],
        providers: [AuthService, PrismaService, JwtAuthMiddleware, RolesGuard],
        exports: [AuthService, JwtModule],
    })
], AuthModule);
export { AuthModule };
//# sourceMappingURL=auth.module.js.map