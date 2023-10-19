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
	HttpCode,
	HttpStatus,
	Req,
	BadRequestException,
} from '@nestjs/common';
import { Request } from 'express';
import { ListsService } from './lists.service';
import { EmailService } from '../email/email.service';
import { ListAuthorizationGuard } from '../guards/list.guard';
import { RemoveListFieldsInterceptor } from './interceptors/remove-list-fields.interceptor';
import { RemoveListCreateFieldsInterceptor } from './interceptors/remove-list-create-fields.interceptor';
import { CreateListDto } from './dtos/create-list.dto';
import { UpdateListDto } from './dtos/update-list.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
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
		return this.listsService.getList(listId);
	}

	@UseInterceptors(RemoveListFieldsInterceptor)
	@Get('/')
	getLists(@Req() req: Request) {
		if (!req.user) throw new BadRequestException('req contains no user');
		return this.listsService.getLists(req.user.id);
	}

	@UseInterceptors(RemoveListCreateFieldsInterceptor)
	@Post('/create')
	createList(@Body() body: CreateListDto, @Req() req: Request) {
		if (!req.user) throw new BadRequestException('req contains no user');
		return this.listsService.createList(body, req.user.id);
	}

	@UseInterceptors(RemoveListFieldsInterceptor)
	@UseGuards(ListAuthorizationGuard)
	@Post('/toggleShare')
	async toggleShareList(
		@Query('listId') listId: string,
		@Query('email') email: string,
		@Req() req: Request,
	) {
		if (!req.user) throw new BadRequestException('req contains no user');

		const list = await this.listsService.toggleShareList(listId, email);

		await this.emailService.sendListSharingEmail(
			[email, req.user.email],
			listId,
			req.user.username,
		);

		return list;
	}

	@UseInterceptors(RemoveListFieldsInterceptor)
	@UseGuards(ListAuthorizationGuard)
	@Patch('/updatePrivacy/:listId')
	@HttpCode(HttpStatus.NO_CONTENT)
	updateListPrivacy(@Param('listId') listId: string) {
		return this.listsService.updateListPrivacy(listId);
	}

	@UseInterceptors(RemoveListCreateFieldsInterceptor)
	@UseGuards(ListAuthorizationGuard)
	@Patch('/update/:listId')
	updateList(@Param('listId') listId: string, @Body() body: UpdateListDto) {
		return this.listsService.updateList(listId, body);
	}

	@UseInterceptors(RemoveListFieldsInterceptor)
	@UseGuards(ListAuthorizationGuard)
	@Delete('/delete/:listId')
	@HttpCode(HttpStatus.NO_CONTENT)
	deleteList(@Param('listId') listId: string, @Req() req: Request) {
		if (!req.user) throw new BadRequestException('req contains no user');
		return this.listsService.deleteList(listId, req.user.id);
	}

	@UseInterceptors(RemoveListFieldsInterceptor)
	@UseGuards(ListAuthorizationGuard)
	@Delete('/deleteMovie')
	@HttpCode(HttpStatus.NO_CONTENT)
	deleteMovie(
		@Query('listId') listId: string,
		@Query('movieId') movieId: string,
	) {
		return this.listsService.deleteListItem(listId, movieId);
	}
}
