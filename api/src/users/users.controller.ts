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
import { AuthService } from './auth.service';
import { AdminGuard } from '../guards/admin.guard';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { ListsService } from '../lists/lists.service';
import { Response, Request } from 'express';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RemoveFieldsInterceptor } from './interceptors/remove-fields.interceptor';
import { FileInterceptor } from '@nestjs/platform-express';
import { FriendStatus } from './users.service';

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
	) {}

	@UseInterceptors(RemoveFieldsInterceptor)
	@UseGuards(JwtAuthGuard)
	@Get('/whoami')
	whoAmI(@Req() req: Request) {
		return req.user;
	}

	@UseInterceptors(RemoveFieldsInterceptor)
	@UseGuards(JwtAuthGuard)
	@Get('/')
	fetchUserById(@Query('userId') userId: string) {
		return this.usersService.getUser(userId);
	}

	@UseInterceptors(RemoveFieldsInterceptor)
	@UseGuards(JwtAuthGuard)
	@Get('/username')
	fetchUserByUsername(@Query('username') username: string) {
		return this.usersService.getUserByUsername(username);
	}

	@UseInterceptors(RemoveFieldsInterceptor)
	@UseGuards(JwtAuthGuard)
	@Get('/email')
	fetchUserByEmail(@Query('email') email: string) {
		return this.usersService.getUserByEmail(email);
	}

	@UseInterceptors(RemoveFieldsInterceptor)
	@UseGuards(JwtAuthGuard)
	@Get('/download')
	async downloadAvatar(@Req() req: Request, @Res() res: Response) {
		if (!req.user) throw new BadRequestException('req contains no user');
		return this.usersService.getAvatar(req.user.id, res);
	}

	@UseGuards(JwtAuthGuard)
	@Get('/friends')
	async getFriends(@Req() req: Request) {
		if (!req.user) throw new BadRequestException('req contains no user');
		return this.usersService.getFriends(req.user.id);
	}

	@UseInterceptors(RemoveFieldsInterceptor)
	@UseGuards(JwtAuthGuard)
	@Post('/signout')
	@HttpCode(HttpStatus.NO_CONTENT)
	signout(@Res({ passthrough: true }) response: Response) {
		response.setHeader('Authorization', '');
	}

	@UseInterceptors(RemoveFieldsInterceptor)
	@Post('/signup')
	async signup(@Body() body: CreateUserDto) {
		const user = await this.authService.signup(body);

		await this.emailService.sendSignupEmail(body.email, body.username);

		return user;
	}

	@UseInterceptors(RemoveFieldsInterceptor)
	@UseGuards(LocalAuthGuard)
	@Post('/signin')
	@HttpCode(HttpStatus.OK)
	async signin(@Req() req: Request) {
		if (!req.user) throw new BadRequestException('req contains no user');
		const user = await this.authService.login(req.user);

		return user;
	}

	@UseInterceptors(RemoveFieldsInterceptor)
	@UseGuards(JwtAuthGuard)
	@HttpCode(HttpStatus.CREATED)
	@Post('/upload')
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
		return this.usersService.updateAvatar(req.user.id, file);
	}

	@UseInterceptors(RemoveFieldsInterceptor)
	@UseGuards(JwtAuthGuard)
	@Post('/friends/send')
	async sendFriendRequest(
		@Req() req: Request,
		@Body() { username }: { username: string },
	) {
		if (!req.user) throw new BadRequestException('req contains no user');
		return await this.usersService.sendFriendRequest(req.user.id, username);
	}

	@UseInterceptors(RemoveFieldsInterceptor)
	@UseGuards(JwtAuthGuard)
	@Post('/friends/update')
	@HttpCode(HttpStatus.OK)
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

	@UseGuards(JwtAuthGuard)
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
	@UseGuards(JwtAuthGuard, AdminGuard)
	@HttpCode(HttpStatus.NO_CONTENT)
	@Delete('/delete')
	async deleteUser(@Req() req: Request) {
		// delete all lists associated with user
		if (!req.user) throw new BadRequestException('req contains no user');

		const userLists = await this.listsService.getLists(req.user.id);
		await Promise.all(
			userLists.List.map((list) =>
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				this.listsService.deleteList(list.id, req.user!.id),
			),
		);

		// delete user
		await this.usersService.deleteUser(req.user.id);
		await this.emailService.sendAccountDeletionEmail(req.user.email);
	}

	@UseInterceptors(RemoveFieldsInterceptor)
	@UseGuards(JwtAuthGuard, AdminGuard)
	@HttpCode(HttpStatus.NO_CONTENT)
	@Delete('/deleteAvatar')
	async deleteUserAvatar(@Req() req: Request) {
		if (!req.user) throw new BadRequestException('req contains no user');
		return this.usersService.deleteUserAvatar(req.user.id);
	}
}
