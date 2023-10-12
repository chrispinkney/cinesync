import { MiddlewareConsumer, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthService } from './auth.service';
import { CurrentUserMiddleware } from './middlewares/current-user.middleware';
import { EmailModule } from '../email/email.module';

@Module({
	imports: [PrismaModule, EmailModule],
	controllers: [UsersController],
	providers: [UsersService, AuthService],
})
export class UsersModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(CurrentUserMiddleware).forRoutes('*');
	}
}
