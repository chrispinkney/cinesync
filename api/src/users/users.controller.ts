import {
	Controller,
	Param,
	Query,
	Body,
	Get,
	Post,
	Delete,
	Session,
	UseGuards,
	HttpCode,
	HttpStatus,
	Res,
	Req,
	BadRequestException,
} from '@nestjs/common';
import { EmailService } from '../email/email.service';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { AuthGuard } from '../guards/auth.guard';
import { AdminGuard } from '../guards/admin.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { ListsService } from '../lists/lists.service';
import { Response, Request } from 'express';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

// @UseInterceptors(RemoveFieldsInterceptor)
@Controller('auth')
export class UsersController {
	constructor(
		private usersService: UsersService,
		private authService: AuthService,
		private emailService: EmailService,
		private listsService: ListsService,
	) {}

	@UseGuards(AuthGuard)
	@Get('/whoami')
	whoAmI(@CurrentUser() user: CreateUserDto) {
		return user;
	}

	@UseGuards(AuthGuard)
	@Get('/:id')
	fetchUserById(@Param('id') id: string) {
		return this.usersService.getUser(id);
	}

	@UseGuards(AuthGuard)
	@Get()
	fetchUserByEmail(@Query('email') email: string) {
		return this.usersService.getUserByEmail(email);
	}

	@UseGuards(AuthGuard)
	@Post('/signout')
	@HttpCode(HttpStatus.NO_CONTENT)
	signout(
		@Session() session: Record<string, null>,
		@Res({ passthrough: true }) response: Response, // {passthrough: true} apparently sends the cookie to the frontend
	) {
		session.userId = null;
		// response.clearCookie('jwt');
		response.setHeader('Authorization', '');
	}

	@Post('/signup')
	async signup(
		@Body() body: CreateUserDto,
		@Session() session: Record<string, string>,
	) {
		const user = await this.authService.signup(body);
		session.userId = user.id;

		await this.emailService.sendSignupEmail(body.email, body.username);

		return user;
	}

	@UseGuards(LocalAuthGuard)
	@Post('/signin')
	@HttpCode(HttpStatus.OK)
	async signin(
		// @Body() body: SigninUserDto,
		// @Session() session: Record<string, string>,
		// @Res({ passthrough: true }) response: Response, // {passthrough: true} apparently sends the cookie to the frontend
		@Req() req: Request,
	) {
		if (!req.user) throw new BadRequestException('req contains no user');
		console.log(`UsersController  req.user:`, req.user);
		const user = await this.authService.login(req.user);
		// session.userId = user.id;

		return user;
	}

	@UseGuards(JwtAuthGuard)
	@Get('/user/profile')
	getProfile(@Req() req: Request) {
		return req.user;
	}

	@UseGuards(AuthGuard)
	updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
		return this.usersService.updateUser(id, body);
	}

	@UseGuards(AuthGuard, AdminGuard)
	@HttpCode(HttpStatus.NO_CONTENT)
	@Delete('/:id')
	async deleteUser(
		@Param('id') id: string,
		@Session() session: Record<string, null>,
		@CurrentUser() user: CreateUserDto,
		@Res({ passthrough: true }) response: Response, // {passthrough: true} apparently sends the cookie to the frontend
	) {
		// delete all lists associated with user
		const userLists = await this.listsService.getLists(id);
		await Promise.all(
			userLists.List.map((list) => this.listsService.deleteList(list.id, id)),
		);

		// delete user
		await this.usersService.deleteUser(id);
		await this.emailService.sendAccountDeletionEmail(user.email);
		return this.signout(session, response);
	}
}
