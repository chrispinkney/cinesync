import {
	BadRequestException,
	CanActivate,
	ExecutionContext,
	Injectable,
} from '@nestjs/common';
import { ListsService } from '../lists.service';
import { UsersService } from '../../users/users.service';

@Injectable()
export class ListPrivacyAuthGuard implements CanActivate {
	constructor(
		private listsService: ListsService,
		private usersService: UsersService,
	) {}

	async canActivate(context: ExecutionContext) {
		const request = context.switchToHttp().getRequest();
		const { user } = request;
		const { listId } = request.body;
		const { creatorId } = await this.listsService.getList(listId);
		const creator = await this.usersService.getUser(creatorId);

		// disallow sharees from altering a list's privacy that they do not own
		if (user.username !== creator.username || user.email !== creator.email) {
			throw new BadRequestException(
				"Sharees cannot alter a list's privacy they do not own",
			);
		}

		return true;
	}
}
