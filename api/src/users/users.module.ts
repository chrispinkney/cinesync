import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthService } from './auth.service';
import { CurrentUserInterceptor } from './interceptors/current-user.interceptor';

@Module({
	imports: [PrismaModule],
	controllers: [UsersController],
	providers: [
		UsersService,
		AuthService,
		// globally (user) scoped interceptor
		{ provide: APP_INTERCEPTOR, useClass: CurrentUserInterceptor },
	],
})
export class UsersModule {}
