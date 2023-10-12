import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ListsModule } from './lists/lists.module';
import { PrismaService } from './prisma/prisma.service';
import { APP_PIPE } from '@nestjs/core';
import { EmailModule } from './email/email.module';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const cookieSession = require('cookie-session');

@Module({
	imports: [ConfigModule, UsersModule, ListsModule, EmailModule],
	controllers: [AppController],
	providers: [
		AppService,
		{
			provide: APP_PIPE,
			useValue: new ValidationPipe({
				whitelist: true,
			}),
		},
		PrismaService,
	],
})
export class AppModule {
	constructor(private configService: ConfigService) {}

	configure(consumer: MiddlewareConsumer) {
		consumer
			.apply(
				cookieSession({
					keys: [this.configService.get('COOKIE_SECRET')],
					maxAge: 30 * 24 * 60 * 60 * 1000,
				}),
			)
			.forRoutes('*');
	}
}
