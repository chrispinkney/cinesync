import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { PrismaModule } from '../prisma/prisma.module';
import { EmailModule } from '../email/email.module';
// import { CurrentUserMiddleware } from './middlewares/current-user.middleware';
import { UserDao } from '../dao/user.dao';
import { ListsService } from '../lists/lists.service';
import { ListDao } from '../dao/list.dao';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
// import { JwtModule } from '@nestjs/jwt';
// import { jwtConstants } from './constants';

@Module({
	imports: [
		PrismaModule,
		EmailModule,
		PassportModule,
		ConfigModule,
		// JwtModule.registerAsync({
		// 	imports: [ConfigModule],
		// 	useFactory: async (configService: ConfigService) => ({
		// 		secret: configService.get<string>('JWT_SECRET'),
		// 		signOptions: { expiresIn: '60s' },
		// 	}),
		// 	inject: [ConfigService],
		// }),
		JwtModule.register({
			secret: process.env.JWT_SECRET,
			signOptions: { expiresIn: '60s' },
		}),
	],
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
export class UsersModule {
	// configure(consumer: MiddlewareConsumer) {
	// 	consumer.apply(CurrentUserMiddleware).forRoutes('*');
	// 	// consumer.apply(JWTMiddleware).forRoutes('*');
	// }
}
