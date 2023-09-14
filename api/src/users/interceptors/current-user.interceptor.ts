import {
	NestInterceptor,
	ExecutionContext,
	CallHandler,
	Injectable,
} from '@nestjs/common';
import { UsersService } from '../users.service';

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
	constructor(private usersServer: UsersService) {}

	async intercept(context: ExecutionContext, handler: CallHandler) {
		const request = context.switchToHttp().getRequest();
		const { userId } = request.session;

		if (userId) {
			const user = await this.usersServer.getUser(userId);

			// attach the current user to each request going through the users service
			request.currentUser = user;
		}

		// continue running the next handler in the chain
		return handler.handle();
	}
}
