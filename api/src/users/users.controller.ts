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

@UseInterceptors(RemoveFieldsInterceptor)
@Controller('auth')
export class UsersController {
	constructor(
		private usersService: UsersService,
		private authService: AuthService,
		private emailService: EmailService,
		private listsService: ListsService,
	) {}

	@UseGuards(JwtAuthGuard)
	@Get('/whoami')
	whoAmI(@Req() req: Request) {
		return req.user;
	}

	@UseGuards(JwtAuthGuard)
	@Get('/')
	fetchUserById(@Query('userId') userId: string) {
		return this.usersService.getUser(userId);
	}

	@UseGuards(JwtAuthGuard)
	@Get()
	fetchUserByEmail(@Query('email') email: string) {
		return this.usersService.getUserByEmail(email);
	}

	@UseGuards(JwtAuthGuard)
	@Get('/download')
	async downloadAvatar(@Req() req: Request, @Res() res: Response) {
		if (!req.user) throw new BadRequestException('req contains no user');
		return this.usersService.getAvatar(req.user.id, res);
	}

	@UseGuards(JwtAuthGuard)
	@Post('/signout')
	@HttpCode(HttpStatus.NO_CONTENT)
	signout(@Res({ passthrough: true }) response: Response) {
		response.setHeader('Authorization', '');
	}

	@Post('/signup')
	async signup(@Body() body: CreateUserDto) {
		const user = await this.authService.signup(body);

		await this.emailService.sendSignupEmail(body.email, body.username);

		return user;
	}

	@UseGuards(LocalAuthGuard)
	@Post('/signin')
	@HttpCode(HttpStatus.OK)
	async signin(@Req() req: Request) {
		if (!req.user) throw new BadRequestException('req contains no user');
		const user = await this.authService.login(req.user);

		return user;
	}

	@UseGuards(JwtAuthGuard)
	@HttpCode(HttpStatus.CREATED)
	@Post('/upload')
	@UseInterceptors(FileInterceptor('image'))
	async uploadAvatar(
		@UploadedFile(
			new ParseFilePipe({
				validators: [
					new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5 MB
					new FileTypeValidator({ fileType: '.(png|jpeg|jpg|gif)' }),
				],
			}),
		)
		file: Express.Multer.File,
		@Req() req: Request,
	) {
		if (!req.user) throw new BadRequestException('req contains no user');
		return this.usersService.updateAvatar(req.user.id, file);
	}

	@UseGuards(JwtAuthGuard)
	@Patch('/update')
	updateUser(@Req() req: Request, @Body() body: UpdateUserDto) {
		if (!req.user) throw new BadRequestException('req contains no user');
		return this.usersService.updateUser(req.user.id, body);
	}

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

	@UseGuards(JwtAuthGuard, AdminGuard)
	@HttpCode(HttpStatus.NO_CONTENT)
	@Delete('/deleteAvatar')
	async deleteUserAvatar(@Req() req: Request) {
		if (!req.user) throw new BadRequestException('req contains no user');
		return this.usersService.deleteUserAvatar(req.user.id);
	}
}
