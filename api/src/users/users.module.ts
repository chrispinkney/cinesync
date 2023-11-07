import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaModule } from '../prisma/prisma.module';
import { EmailModule } from '../email/email.module';
import { UserDao } from './daos/user.dao';
import { ListsService } from '../lists/lists.service';
import { ListDao } from '../lists/daos/list.dao';
import { LocalStrategy } from './auth/passport/local.strategy';
import { JwtStrategy } from './auth/passport/jwt.strategy';
import { CommentDao } from '../lists/daos/comment.dao';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { AvatarService } from './avatar/avatar.service';
import { AvatarModule } from './avatar/avatar.module';
import { AvatarDao } from './daos/avatar.dao';
import { ExportModule } from './export/export.module';

@Module({
	imports: [
		PrismaModule,
		EmailModule,
		PassportModule,
		ConfigModule,
		AuthModule,
		AvatarModule,
		ExportModule,
	],
	controllers: [UsersController],
	providers: [
		UsersService,
		AuthService,
		ListsService,
		JwtService,
		AvatarService,
		AvatarDao,
		UserDao,
		ListDao,
		CommentDao,
		LocalStrategy,
		JwtStrategy,
	],
})
export class UsersModule {}
