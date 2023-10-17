import { BadRequestException, Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
	constructor(
		private usersService: UsersService,
		private jwtService: JwtService,
	) {}

	async signup(createUser: CreateUserDto) {
		// See if email is in use
		const { username, email, password } = createUser;

		// Hash user's password with Argon2
		const hashedPassword = await argon2.hash(password);

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
				secret: process.env.JWT_SECRET,
			}),
		};
	}
}
