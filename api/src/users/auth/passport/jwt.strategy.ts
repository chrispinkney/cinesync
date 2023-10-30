import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../../users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(private userService: UsersService) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: process.env.JWT_SECRET,
		});
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	async validate(payload: any) {
		// set req user object, used in ever route
		const user = this.userService.getUser(payload.sub);

		if (!user) {
			throw new UnauthorizedException();
		}

		return user;
	}
}
