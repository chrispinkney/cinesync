import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ListDao } from '../../lists/daos/list.dao';

@Injectable()
export class CommentAuthorizationGuard implements CanActivate {
	constructor(private listDao: ListDao) {}

	async canActivate(context: ExecutionContext) {
		const request = context.switchToHttp().getRequest();
		const user = request.user;
		const listId = request.body.listId;
		const commentId = request.body.commentId;

		const list = await this.listDao.getList(listId);

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
		if (list.creatorId === user.id) {
			return true;
		}

		// allow access if the comment belongs to the user allow actions
		if (comment?.authorId === user.id) {
			return true;
		}

		return false;
	}
}
