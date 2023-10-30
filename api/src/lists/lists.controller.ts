import {
	Controller,
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
import { ListAuthorizationGuard } from './guards/list.guard';
import { RemoveListFieldsInterceptor } from './interceptors/remove-list-fields.interceptor';
import { RemoveListCreateFieldsInterceptor } from './interceptors/remove-list-create-fields.interceptor';
import { CreateListDto } from './dtos/create-list.dto';
import { UpdateListDto } from './dtos/update-list.dto';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { UpdateCommentDto } from './dtos/update-comment.dto';
import { JwtAuthGuard } from '../users/guards/jwt-auth.guard';
import { CommentAuthorizationGuard } from '../users/guards/comment-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('lists')
export class ListsController {
	constructor(
		private listsService: ListsService,
		private emailService: EmailService,
	) {}

	@UseInterceptors(RemoveListCreateFieldsInterceptor)
	@UseGuards(ListAuthorizationGuard)
	@Get('/list')
	getList(@Query('listId') listId: string) {
		return this.listsService.getList(listId);
	}

	@UseInterceptors(RemoveListFieldsInterceptor)
	@Get('/')
	getLists(@Req() req: Request) {
		if (!req.user) throw new BadRequestException('req contains no user');
		return this.listsService.getLists(req.user.id);
	}

	@UseGuards(ListAuthorizationGuard)
	@Get('/sharees')
	getSharees(@Query('listId') listId: string, @Req() req: Request) {
		if (!req.user) throw new BadRequestException('req contains no user');
		return this.listsService.getSharees(listId, req.user.id);
	}

	@UseInterceptors(RemoveListCreateFieldsInterceptor)
	@Post('/create')
	createList(@Body() body: CreateListDto, @Req() req: Request) {
		if (!req.user) throw new BadRequestException('req contains no user');
		return this.listsService.createList(body, req.user.id);
	}

	@UseInterceptors(RemoveListFieldsInterceptor)
	@UseGuards(ListAuthorizationGuard)
	@Post('/toggleShareByUsername')
	async toggleShareListByUsername(
		@Body() { listId, username }: { listId: string; username: string },
		@Req() req: Request,
	) {
		if (!req.user) throw new BadRequestException('req contains no user');

		return this.listsService.toggleShareByUsername(listId, username);
	}

	@UseInterceptors(RemoveListFieldsInterceptor)
	@UseGuards(ListAuthorizationGuard)
	@Post('/toggleShare')
	async toggleShareList(
		@Body() { listId, email }: { listId: string; email: string },
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
	@Post('/comments')
	async createComment(
		@Body() createCommentDto: CreateCommentDto,
		@Req() req: Request,
	) {
		if (!req.user) throw new BadRequestException('req contains no user');
		return this.listsService.createComment(createCommentDto, req.user.id);
	}

	@UseInterceptors(RemoveListFieldsInterceptor)
	@UseGuards(ListAuthorizationGuard)
	@Patch('/updatePrivacy')
	@HttpCode(HttpStatus.NO_CONTENT)
	updateListPrivacy(@Body() { listId }: { listId: string }) {
		return this.listsService.updateListPrivacy(listId);
	}

	@UseInterceptors(RemoveListCreateFieldsInterceptor)
	@UseGuards(ListAuthorizationGuard)
	@Patch('/update')
	updateList(@Body() body: UpdateListDto) {
		return this.listsService.updateList(body);
	}

	@UseGuards(ListAuthorizationGuard, CommentAuthorizationGuard)
	@Patch('/comments/update')
	@HttpCode(HttpStatus.NO_CONTENT)
	async updateComment(@Body() updateCommentDto: UpdateCommentDto) {
		return this.listsService.updateComment(updateCommentDto);
	}

	@UseInterceptors(RemoveListFieldsInterceptor)
	@UseGuards(ListAuthorizationGuard)
	@Delete('/delete')
	@HttpCode(HttpStatus.NO_CONTENT)
	deleteList(@Body() { listId }: { listId: string }, @Req() req: Request) {
		if (!req.user) throw new BadRequestException('req contains no user');
		return this.listsService.deleteList(listId, req.user.id);
	}

	@UseInterceptors(RemoveListFieldsInterceptor)
	@UseGuards(ListAuthorizationGuard)
	@Delete('/deleteMovie')
	@HttpCode(HttpStatus.NO_CONTENT)
	deleteMovie(
		@Body() { listId, movieId }: { listId: string; movieId: string },
	) {
		return this.listsService.deleteListItem(listId, movieId);
	}

	@UseGuards(ListAuthorizationGuard, CommentAuthorizationGuard)
	@Delete('/comments/delete')
	@HttpCode(HttpStatus.NO_CONTENT)
	deleteComment(@Body() { commentId }: { commentId: string }) {
		return this.listsService.deleteComment(commentId);
	}
}
