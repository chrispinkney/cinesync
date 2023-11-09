import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { JwtAuthGuard } from './users/guards/jwt-auth.guard';
import { UsersModule } from './users/users.module';
import { ListsModule } from './lists/lists.module';
import { EmailModule } from './email/email.module';
import { AvatarModule } from './users/avatar/avatar.module';

@Module({
	imports: [ConfigModule, UsersModule, ListsModule, EmailModule, AvatarModule],
	controllers: [AppController],
	providers: [
		{
			provide: APP_GUARD,
			useClass: JwtAuthGuard,
		},
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
