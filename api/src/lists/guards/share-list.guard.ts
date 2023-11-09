import {
	BadRequestException,
	CanActivate,
	ExecutionContext,
	Injectable,
} from '@nestjs/common';
import { ListsService } from '../lists.service';
import { UsersService } from '../../users/users.service';

@Injectable()
export class ShareListAuthGuard implements CanActivate {
	constructor(
		private listsService: ListsService,
		private usersService: UsersService,
	) {}

	async canActivate(context: ExecutionContext) {
		const request = context.switchToHttp().getRequest();
		const { user } = request;
		const sharee = request.body.username || request.body.email;
		const { listId } = request.body;
		const { creatorId } = await this.listsService.getList(listId);
		const creator = await this.usersService.getUser(creatorId);

		// disallow the list creator from sharing/unsharing themselves
		if (user.username === sharee || user.email === sharee) {
			throw new BadRequestException('Cannot unshare user from their own list');
		}

		// disallow sharees from sharing/unsharing a list they do not own
		if (user.username !== creator.username || user.email !== creator.email) {
			throw new BadRequestException(
				'Sharees cannot share or unshare a list they do not own',
			);
		}

		return true;
	}
}
