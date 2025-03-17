import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthRequest } from './auth.types.js';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRole = this.reflector.get<string>('role', context.getHandler());
    if (!requiredRole) return true;

    const request = context.switchToHttp().getRequest<AuthRequest>();
    if (!request.user) {
      throw new ForbiddenException('Usuário não autenticado');
    }

    if (request.user.role !== requiredRole) {
      throw new ForbiddenException('Permissão insuficiente');
    }

    return true;
  }
}
