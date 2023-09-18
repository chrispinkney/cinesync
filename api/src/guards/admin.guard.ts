import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Role } from '@prisma/client';

@Injectable()
export class AdminGuard implements CanActivate {
	canActivate(context: ExecutionContext): boolean {
		const request = context.switchToHttp().getRequest();
		const user = request.currentUser;

		// Allow administrators to proceed
		if (user.role === Role.ADMIN) {
			return true;
		}

		// check if the user is trying to access their own account
		const userId = request.params.id;
		if (user.id === parseInt(userId)) {
			return true;
		}

		return false;
	}
}
