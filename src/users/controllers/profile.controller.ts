import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesAuthGuard } from '../../auth/guards/roles-auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '../../auth/models/roles.model';
import { OrdersService } from '../services/orders.service';
import { PayloadToken } from '../../auth/models/token.model';
import { Request } from 'express';

@UseGuards(JwtAuthGuard, RolesAuthGuard)
@ApiTags('profile')
@Controller('profile')
@Controller('profile')
export class ProfileController {
  constructor(private orderService: OrdersService) {}

  @Roles(Role.CUSTOMER)
  @Get('my-orders')
  getOrders(@Req() req: Request) {
    const user = req.user as PayloadToken;
    console.log('token: ', user);
    return this.orderService.ordersByCustomer(user.sub);
  }
}
