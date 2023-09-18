import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import * as argon2 from 'argon2';
import { CreateUserDto } from './dtos/create-user.dto';

@Injectable()
export class AuthService {
	constructor(private usersService: UsersService) {}

	async signup(createUser: CreateUserDto) {
		// See if email is in use
		const { username, email, password } = createUser;
		const userExists = await this.usersService.getUserByEmail(email);

		if (userExists !== null) {
			throw new BadRequestException('email in use');
		}

		// Hash user's password with Argon2
		try {
			const hashedPassword = await argon2.hash(password);

			// Create a new user with the hashed password
			const user = await this.usersService.createUser({
				username,
				email,
				password: hashedPassword,
			});

			return user;
		} catch (error) {
			throw new InternalServerErrorException('Failed to create user');
		}
	}

	async signin(email: string, password: string) {
		const user = await this.usersService.getUserByEmail(email);

		if (!user) {
			throw new BadRequestException('User not found');
		}

		const passwordsMatch = await argon2.verify(user.password, password);

		if (!passwordsMatch) {
			throw new BadRequestException('Incorrect password');
		}

		return user;
	}
}
