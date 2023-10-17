import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { PrismaModule } from '../prisma/prisma.module';
import { EmailModule } from '../email/email.module';
import { UserDao } from '../dao/user.dao';
import { ListsService } from '../lists/lists.service';
import { ListDao } from '../dao/list.dao';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';

@Module({
	imports: [PrismaModule, EmailModule, PassportModule, ConfigModule],
	controllers: [UsersController],
	providers: [
		UsersService,
		AuthService,
		UserDao,
		ListDao,
		ListsService,
		JwtService,
		LocalStrategy,
		JwtStrategy,
	],
})
export class UsersModule {}
