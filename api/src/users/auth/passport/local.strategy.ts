import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
	constructor(private authService: AuthService) {
		super({ usernameField: 'email' });
	}

	// only used for /signin
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	async validate(username: string, password: string) {
		const user = await this.authService.validateUser(username, password);

		if (!user) {
			throw new UnauthorizedException();
		}

		return user;
	}
}
