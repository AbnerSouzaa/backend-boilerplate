import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard.js';
import { Role } from '../../auth/role.decorator.js';
import { RolesGuard } from '../../auth/roles.guard.js';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Role('ADMIN')
  async getAllUsers() {
    return this.usersService.findAll();
  }

  @Get(':email')
  async getUserByEmail(@Param('email') email: string) {
    return this.usersService.findByEmail(email);
  }
}
