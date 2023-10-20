import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as argon2 from 'argon2';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';

@Injectable()
export class AuthService {
	constructor(
		private usersService: UsersService,
		private jwtService: JwtService,
		private configService: ConfigService,
	) {}

	async encrypt(password: string) {
		return await argon2.hash(password);
	}

	async signup(createUser: CreateUserDto) {
		// See if email is in use
		const { username, email, password } = createUser;

		// Hash user's password with Argon2
		const hashedPassword = await this.encrypt(password);

		// Create a new user with the hashed password
		const user = await this.usersService.createUser({
			username,
			email,
			password: hashedPassword,
		});

		return user;
	}

	async validateUser(email: string, password: string) {
		try {
			const user = await this.usersService.getUserByEmail(email);

			const passwordsMatch = await argon2.verify(user.password, password);

			if (!passwordsMatch) {
				throw new BadRequestException('Email or Password are incorrect');
			}

			return user;
		} catch (error) {
			throw new BadRequestException('Email or Password are incorrect');
		}
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	async login(user: any) {
		const payload = { username: user.email, sub: user.id };

		return {
			access_token: this.jwtService.sign(payload, {
				secret: this.configService.get<string>('JWT_SECRET'),
				...(this.configService.get<string>('NODE_ENV') === 'production'
					? {
							expiresIn: '7d',
					  }
					: null),
			}),
		};
	}
}
