import {
	Controller,
	Param,
	Body,
	Get,
	Post,
	Patch,
	Delete,
	UseGuards,
	UseInterceptors,
	Query,
} from '@nestjs/common';
import { ListsService } from './lists.service';
import { AuthGuard } from '../guards/auth.guard';
import { CreateListDto } from './dtos/create-list.dto';
import { UpdateListDto } from './dtos/update-list.dto';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { UserDto } from '../users/dtos/user.dto';
import { RemoveListFieldsInterceptor } from './interceptors/remove-list-fields.interceptor';
import { ListAuthorizationGuard } from '../guards/list.guard';
import { EmailService } from '../email/email.service';

@UseInterceptors(RemoveListFieldsInterceptor)
@Controller('lists')
export class ListsController {
	constructor(
		private listsService: ListsService,
		private emailService: EmailService,
	) {}

	@UseGuards(ListAuthorizationGuard)
	@Get('/:listId')
	getList(@Param('listId') listId: string) {
		return this.listsService.getList(parseInt(listId));
	}

	@UseGuards(AuthGuard)
	@Get('/')
	getLists(@CurrentUser() user: UserDto) {
		return this.listsService.getLists(user.id);
	}

	@UseGuards(AuthGuard)
	@Post('/create')
	createList(@Body() body: CreateListDto, @CurrentUser() user: UserDto) {
		return this.listsService.createList(body, user.id);
	}

	@UseGuards(AuthGuard)
	@Post('/shareId/:listId')
	shareList(
		@Param('listId') listId: string,
		@Query('id') recipientId: string,
		@CurrentUser() user: UserDto,
	) {
		return this.listsService.shareListById(
			parseInt(listId),
			recipientId,
			user.id,
		);
	}

	@UseGuards(AuthGuard)
	@Post('/share/:listId')
	async shareListByEmail(
		@Param('listId') listId: string,
		@Query('email') email: string,
		@CurrentUser() user: UserDto,
	) {
		const list = await this.listsService.shareListByEmail(
			parseInt(listId),
			email,
			user.id,
		);

		await this.emailService.sendListSharingEmail(
			[email, user.email],
			listId,
			user.username,
		);

		return list;
	}

	@UseGuards(AuthGuard)
	@Post('/unshare/:listId')
	unshareList(
		@Param('listId') listId: string,
		@Query('id') recipientId: string,
		@CurrentUser() user: UserDto,
	) {
		return this.listsService.unshareListById(
			parseInt(listId),
			recipientId,
			user.id,
		);
	}

	@UseGuards(ListAuthorizationGuard, AuthGuard)
	@Patch('/updatePrivacy/:listId')
	updateListPrivacy(
		@Param('listId') listId: string,
		@CurrentUser() user: UserDto,
	) {
		return this.listsService.updateListPrivacy(parseInt(listId), user.id);
	}

	@UseGuards(ListAuthorizationGuard, AuthGuard)
	@Patch('/update/:listId')
	updateList(
		@Param('listId') listId: string,
		@Body() body: UpdateListDto,
		@CurrentUser() user: UserDto,
	) {
		return this.listsService.updateList(parseInt(listId), body, user.id);
	}

	@Delete('/delete/:listId')
	deleteList(@Param('listId') listId: string, @CurrentUser() user: UserDto) {
		return this.listsService.deleteList(parseInt(listId), user.id);
	}

	@UseGuards(AuthGuard)
	@Delete('/delete/:listId/:movieId')
	deleteListItem(
		@Param('listId') listId: string,
		@Param('movieId') movieId: string,
		@CurrentUser() user: UserDto,
	) {
		return this.listsService.deleteListItem(
			parseInt(listId),
			parseInt(movieId),
			user.id,
		);
	}
}
