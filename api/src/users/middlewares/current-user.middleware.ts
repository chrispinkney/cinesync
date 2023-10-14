import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UsersService } from '../users.service';
import { User } from '@prisma/client';

declare global {
	// eslint-disable-next-line @typescript-eslint/no-namespace
	namespace Express {
		interface Request {
			currentUser: User | null;
		}
	}
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
	constructor(private usersService: UsersService) {}

	async use(req: Request, res: Response, next: NextFunction) {
		const { userId } = req.session || {};

		if (userId) {
			const user = await this.usersService.getUser(userId);
			req.currentUser = user || null;
		}

		next();
	}
}
