import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ListAuthorizationGuard implements CanActivate {
	constructor(private prisma: PrismaService) {}

	async canActivate(context: ExecutionContext) {
		const request = context.switchToHttp().getRequest();
		const { currentUser } = request;

		const listId = parseInt(request.params.listId);

		try {
			const list = await this.prisma.list.findUnique({
				where: { id: listId },
				include: {
					User: true,
				},
			});

			// check if list exists
			if (!list) {
				return false;
			}

			// check if list belongs to the user or has been shared with the user
			const isCreator = list.creator_id === currentUser.id;
			const isSharedWithUser =
				list.User.find((user) => user.id === currentUser.id) !== undefined;

			return isCreator || isSharedWithUser;
		} catch (error) {
			throw new Error('Failed to check list permission');
		}
	}
}
