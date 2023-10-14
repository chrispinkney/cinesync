import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ListAuthorizationGuard implements CanActivate {
	constructor(private prisma: PrismaService) {}

	async canActivate(context: ExecutionContext) {
		const request = context.switchToHttp().getRequest();
		const { currentUser } = request;

		const listId =
			parseInt(request.params.listId) || parseInt(request.query.listId);

		const list = await this.prisma.list.findUniqueOrThrow({
			where: { id: listId },
			include: {
				User: true,
			},
		});

		// allow access if list is public and no user is logged in
		if (!list.is_private && !currentUser) {
			return true;
		}

		// allow access if list is public and user is logged in
		if (!list.is_private && currentUser) {
			return true;
		}

		// restrict access if no user is logged in
		if (!currentUser) {
			return false;
		}

		// check if list belongs to the user or has been shared with the user
		const isCreator = list.creator_id === currentUser.id;
		const isSharedWithUser =
			list.User.find((user) => user.id === currentUser.id) !== undefined;

		return isCreator || isSharedWithUser;
	}
}
