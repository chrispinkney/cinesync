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
import { EmailService } from '../email/email.service';
import { AuthGuard } from '../guards/auth.guard';
import { ListAuthorizationGuard } from '../guards/list.guard';
import { RemoveListFieldsInterceptor } from './interceptors/remove-list-fields.interceptor';
import { RemoveListCreateFieldsInterceptor } from './interceptors/remove-list-create-fields.interceptor';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { CreateListDto } from './dtos/create-list.dto';
import { UpdateListDto } from './dtos/update-list.dto';
import { UserDto } from '../users/dtos/user.dto';

@Controller('lists')
export class ListsController {
	constructor(
		private listsService: ListsService,
		private emailService: EmailService,
	) {}

	@UseInterceptors(RemoveListCreateFieldsInterceptor)
	@UseGuards(ListAuthorizationGuard)
	@Get('/:listId')
	getList(@Param('listId') listId: string) {
		return this.listsService.getList(parseInt(listId));
	}

	@UseInterceptors(RemoveListFieldsInterceptor)
	@UseGuards(AuthGuard)
	@Get('/')
	getLists(@CurrentUser() user: UserDto) {
		return this.listsService.getLists(user.id);
	}

	@UseInterceptors(RemoveListCreateFieldsInterceptor)
	@UseGuards(AuthGuard)
	@Post('/create')
	createList(@Body() body: CreateListDto, @CurrentUser() user: UserDto) {
		return this.listsService.createList(body, user.id);
	}

	@UseInterceptors(RemoveListFieldsInterceptor)
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

	@UseInterceptors(RemoveListFieldsInterceptor)
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

	@UseInterceptors(RemoveListFieldsInterceptor)
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

	@UseInterceptors(RemoveListFieldsInterceptor)
	@UseGuards(ListAuthorizationGuard, AuthGuard)
	@Patch('/updatePrivacy/:listId')
	updateListPrivacy(
		@Param('listId') listId: string,
		@CurrentUser() user: UserDto,
	) {
		return this.listsService.updateListPrivacy(parseInt(listId), user.id);
	}

	@UseInterceptors(RemoveListFieldsInterceptor)
	@UseGuards(ListAuthorizationGuard, AuthGuard)
	@Patch('/update/:listId')
	updateList(
		@Param('listId') listId: string,
		@Body() body: UpdateListDto,
		@CurrentUser() user: UserDto,
	) {
		return this.listsService.updateList(parseInt(listId), body, user.id);
	}

	@UseInterceptors(RemoveListFieldsInterceptor)
	@Delete('/delete/:listId')
	deleteList(@Param('listId') listId: string, @CurrentUser() user: UserDto) {
		return this.listsService.deleteList(parseInt(listId), user.id);
	}

	@UseInterceptors(RemoveListFieldsInterceptor)
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
