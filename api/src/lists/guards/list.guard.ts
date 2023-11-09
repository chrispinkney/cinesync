import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ListAuthorizationGuard implements CanActivate {
	constructor(private prisma: PrismaService) {}

	async canActivate(context: ExecutionContext) {
		const request = context.switchToHttp().getRequest();
		const { user } = request;

		const listId = request.query.listId || request.body.listId;

		const list = await this.prisma.list.findUniqueOrThrow({
			where: { id: listId },
			include: {
				user: true,
			},
		});

		// restrict access if no user is logged in
		if (!user) {
			return false;
		}

		// check if list belongs to the user or has been shared with the user
		const isCreator = list.creatorId === user.id;
		const isSharedWithUser =
			list.user.find((sharedUser) => sharedUser.id === user.id) !== undefined;

		return isCreator || isSharedWithUser;
	}
}
