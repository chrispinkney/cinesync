import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor() {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: process.env.JWT_SECRET,
		});
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	async validate(payload: any) {
		console.log(`JwtStrategy  validate  payload:`, payload);
		// return more user info via db call later???
		return { userId: payload.sub, email: payload.username };
	}
}
