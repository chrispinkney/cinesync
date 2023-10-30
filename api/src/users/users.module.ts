import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { PrismaModule } from '../prisma/prisma.module';
import { EmailModule } from '../email/email.module';
import { UserDao } from './daos/user.dao';
import { ListsService } from '../lists/lists.service';
import { ListDao } from '../lists/daos/list.dao';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
import { CommentDao } from '../lists/daos/comment.dao';

@Module({
	imports: [PrismaModule, EmailModule, PassportModule, ConfigModule],
	controllers: [UsersController],
	providers: [
		UsersService,
		AuthService,
		ListsService,
		JwtService,
		UserDao,
		ListDao,
		CommentDao,
		LocalStrategy,
		JwtStrategy,
	],
})
export class UsersModule {}
