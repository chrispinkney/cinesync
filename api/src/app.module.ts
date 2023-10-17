import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ListsModule } from './lists/lists.module';
import { PrismaService } from './prisma/prisma.service';
import { EmailModule } from './email/email.module';
import { JwtService } from '@nestjs/jwt';

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
		JwtService,
	],
})
export class AppModule {}
