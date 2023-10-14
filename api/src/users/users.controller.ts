import {
	Controller,
	Param,
	Query,
	Body,
	Get,
	Post,
	Patch,
	Delete,
	UseInterceptors,
	Session,
	UseGuards,
} from '@nestjs/common';
import { EmailService } from '../email/email.service';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { AuthGuard } from '../guards/auth.guard';
import { AdminGuard } from '../guards/admin.guard';
import { RemoveFieldsInterceptor } from './interceptors/remove-fields.interceptor';
import { CurrentUser } from './decorators/current-user.decorator';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { SigninUserDto } from './dtos/signin-user.dto';

@UseInterceptors(RemoveFieldsInterceptor)
@Controller('auth')
export class UsersController {
	constructor(
		private usersService: UsersService,
		private authService: AuthService,
		private emailService: EmailService,
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
	signout(@Session() session: Record<string, null>) {
		session.userId = null;
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

	@Post('/signin')
	async signin(
		@Body() body: SigninUserDto,
		@Session() session: Record<string, string>,
	) {
		const user = await this.authService.signin(body.email, body.password);
		session.userId = user.id;

		return user;
	}

	@UseGuards(AuthGuard)
	@Patch('/:id')
	updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
		return this.usersService.updateUser(id, body);
	}

	@UseGuards(AuthGuard, AdminGuard)
	@Delete('/:id')
	async deleteUser(
		@Param('id') id: string,
		@Session() session: Record<string, null>,
		@CurrentUser() user: CreateUserDto,
	) {
		await this.usersService.deleteUser(id);
		await this.emailService.sendAccountDeletionEmail(user.email);
		return this.signout(session);
	}
}
