import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CommentAuthorizationGuard implements CanActivate {
	constructor(private prisma: PrismaService) {}

	async canActivate(context: ExecutionContext) {
		const request = context.switchToHttp().getRequest();
		const user = request.user;
		const listId = request.body.listId;
		const commentId = request.body.commentId;

		const list = await this.prisma.list.findUniqueOrThrow({
			where: { id: listId },
			select: {
				id: true,
				name: true,
				is_private: true,
				creator_id: true,
				created_at: true,
				updated_at: true,
				Movie: true,
				User: true,
				comments: {
					select: {
						id: true,
						text: true,
						authorId: true,
						createdAt: true,
						updatedAt: true,
					},
					orderBy: {
						createdAt: 'asc',
					},
				},
			},
		});

		const comment = list.comments.find((c) => c.id === commentId);

		// restrict access if no user is logged in
		if (!user) {
			return false;
		}

		// restrict access if no commentId is provided or if the commentId cannot be found on the list
		if (!comment || !commentId) {
			return false;
		}

		// allow access if the user is the list's creator allow all actions
		if (list.creator_id === user.id) {
			return true;
		}

		// allow access if the comment belongs to the user allow actions
		if (comment?.authorId === user.id) {
			return true;
		}

		return false;
	}
}
