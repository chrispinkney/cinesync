import {
	Controller,
	Query,
	Body,
	Get,
	Post,
	Delete,
	UseGuards,
	HttpCode,
	HttpStatus,
	Res,
	Req,
	BadRequestException,
	UseInterceptors,
	Patch,
	UploadedFile,
	ParseFilePipe,
	MaxFileSizeValidator,
	FileTypeValidator,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { Express } from 'express';
import { EmailService } from '../email/email.service';
import { UsersService } from './users.service';
import { AuthService } from './auth/auth.service';
import { AdminGuard } from './guards/admin.guard';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { ListsService } from '../lists/lists.service';
import { Response, Request } from 'express';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RemoveFieldsInterceptor } from './interceptors/remove-fields.interceptor';
import { FileInterceptor } from '@nestjs/platform-express';
import { FriendStatus } from './users.service';
import { AvatarService } from './avatar/avatar.service';
import { Public } from './decorators/public.decorator';

declare global {
	// eslint-disable-next-line @typescript-eslint/no-namespace
	namespace Express {
		interface User {
			id: string;
			username: string;
			email: string;
			role: Role;
		}
	}
}

@Controller('auth')
export class UsersController {
	constructor(
		private usersService: UsersService,
		private authService: AuthService,
		private emailService: EmailService,
		private listsService: ListsService,
		private avatarService: AvatarService,
	) {}

	@UseInterceptors(RemoveFieldsInterceptor)
	@Get('/whoami')
	whoAmI(@Req() req: Request) {
		return req.user;
	}

	@UseInterceptors(RemoveFieldsInterceptor)
	@Get('/')
	fetchUserById(@Query('userId') userId: string) {
		return this.usersService.getUser(userId);
	}

	@UseInterceptors(RemoveFieldsInterceptor)
	@Get('/username')
	fetchUserByUsername(@Query('username') username: string) {
		return this.usersService.getUserByUsername(username);
	}

	@UseInterceptors(RemoveFieldsInterceptor)
	@Get('/email')
	fetchUserByEmail(@Query('email') email: string) {
		return this.usersService.getUserByEmail(email);
	}

	@UseInterceptors(RemoveFieldsInterceptor)
	@Public()
	@Post('/signup')
	async signup(@Body() body: CreateUserDto) {
		const user = await this.authService.signup(body);

		await this.emailService.sendSignupEmail(body.email, body.username);

		return user;
	}

	@UseInterceptors(RemoveFieldsInterceptor)
	@UseGuards(LocalAuthGuard)
	@Public()
	@Post('/signin')
	@HttpCode(HttpStatus.OK)
	async signin(@Req() req: Request) {
		if (!req.user) throw new BadRequestException('req contains no user');
		const user = await this.authService.login(req.user);

		return user;
	}

	@Get('/friends')
	async getFriends(@Req() req: Request) {
		if (!req.user) throw new BadRequestException('req contains no user');
		return this.usersService.getFriends(req.user.id);
	}

	@UseInterceptors(RemoveFieldsInterceptor)
	@Post('/friends/send')
	@HttpCode(HttpStatus.NO_CONTENT)
	async sendFriendRequest(
		@Req() req: Request,
		@Body() { username }: { username: string },
	) {
		if (!req.user) throw new BadRequestException('req contains no user');
		return await this.usersService.sendFriendRequest(req.user.id, username);
	}

	@UseInterceptors(RemoveFieldsInterceptor)
	@Post('/friends/update')
	@HttpCode(HttpStatus.NO_CONTENT)
	async updateFriendRequest(
		@Req() req: Request,
		@Body() { username, status }: { username: string; status: FriendStatus },
	) {
		if (!req.user) throw new BadRequestException('req contains no user');
		return await this.usersService.updateFriendship(
			req.user.id,
			username,
			status,
		);
	}

	@UseInterceptors(RemoveFieldsInterceptor)
	@Patch('/update')
	async updateUser(@Req() req: Request, @Body() body: UpdateUserDto) {
		if (!req.user) throw new BadRequestException('req contains no user');

		// encrypt password before updating user
		if (body?.password) {
			body.password = await this.authService.encrypt(body.password);
		}

		return this.usersService.updateUser(req.user.id, body);
	}

	@UseInterceptors(RemoveFieldsInterceptor)
	@UseGuards(AdminGuard)
	@HttpCode(HttpStatus.NO_CONTENT)
	@Delete('/delete')
	async deleteUser(@Req() req: Request) {
		// delete all lists associated with user
		if (!req.user) throw new BadRequestException('req contains no user');

		const userLists = await this.listsService.getLists(req.user.id);
		await Promise.all(
			userLists.list.map((list) =>
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				this.listsService.deleteList(list.id, req.user!.id),
			),
		);

		// delete user
		await this.usersService.deleteUser(req.user.id);
		await this.emailService.sendAccountDeletionEmail(req.user.email);
	}

	@UseInterceptors(RemoveFieldsInterceptor)
	@Get('/avatar')
	async downloadUsersAvatar(
		@Query('username') username: string,
		@Req() req: Request,
		@Res() res: Response,
	) {
		if (!req.user) throw new BadRequestException('req contains no user');

		return await this.avatarService.getAvatarByUsername(username, res);
	}

	@UseInterceptors(RemoveFieldsInterceptor)
	@Get('/avatar/download')
	async downloadAvatar(@Req() req: Request, @Res() res: Response) {
		if (!req.user) throw new BadRequestException('req contains no user');

		return await this.avatarService.getAvatar(req.user.id, res);
	}

	@UseInterceptors(RemoveFieldsInterceptor)
	@HttpCode(HttpStatus.NO_CONTENT)
	@Post('/avatar/upload')
	@UseInterceptors(FileInterceptor('image'))
	async uploadAvatar(
		@UploadedFile(
			new ParseFilePipe({
				validators: [
					new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5 MB
					new FileTypeValidator({ fileType: '.(png|jpeg|gif)' }),
				],
			}),
		)
		file: Express.Multer.File,
		@Req() req: Request,
	) {
		if (!req.user) throw new BadRequestException('req contains no user');
		return this.avatarService.updateAvatar(req.user.id, file);
	}

	@UseInterceptors(RemoveFieldsInterceptor)
	@UseGuards(AdminGuard)
	@HttpCode(HttpStatus.NO_CONTENT)
	@Delete('/avatar/delete')
	async deleteUserAvatar(@Req() req: Request) {
		if (!req.user) throw new BadRequestException('req contains no user');
		return this.avatarService.deleteUserAvatar(req.user.id);
	}
}
