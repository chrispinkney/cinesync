import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ListsModule } from './lists/lists.module';
import { PrismaService } from './prisma/prisma.service';
import { EmailModule } from './email/email.module';
import { JwtService } from '@nestjs/jwt';
// import { JwtModule, JwtService } from '@nestjs/jwt';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const cookieSession = require('cookie-session');

@Module({
	imports: [
		ConfigModule,
		UsersModule,
		ListsModule,
		EmailModule,
		// JwtModule.register({
		// 	global: true,
		// 	secret: 'heysailor',
		// 	signOptions: { expiresIn: '1d' },
		// }),
	],
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
		JwtService,
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
