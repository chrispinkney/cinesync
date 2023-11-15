import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Role } from '@prisma/client';
import { CacheService } from '../../cache/cache.service';

@Injectable()
export class ListAuthGuard implements CanActivate {
	constructor(
		private prisma: PrismaService,
		private cacheService: CacheService,
	) {}

	async canActivate(context: ExecutionContext) {
		const request = context.switchToHttp().getRequest();
		const { user } = request;

		const listId = request.query.listId || request.body.listId;

		const list = await this.prisma.list.findUniqueOrThrow({
			where: { id: listId },
			include: {
				user: true,
				movie: true,
			},
		});
		console.log(`ListAuthGuard  canActivate  list:`, list);

		await this.cacheService.set(listId, list);

		// allow access to list if the user is an admin
		if (user.role === Role.ADMIN) {
			return true;
		}

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
