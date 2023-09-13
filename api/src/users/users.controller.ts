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
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UsersService } from './users.service';
import { RemoveFieldsInterceptor } from './interceptors/remove-fields.interceptor';

@UseInterceptors(RemoveFieldsInterceptor)
@Controller('auth')
export class UsersController {
	constructor(private usersService: UsersService) {}

	@Get('/:id')
	fetchUserById(@Param('id') id: string) {
		return this.usersService.getUser(parseInt(id));
	}

	@Get()
	fetchUserByEmail(@Query('email') email: string) {
		return this.usersService.getUserByEmail(email);
	}

	@Post('/signup')
	createUser(@Body() body: CreateUserDto) {
		return this.usersService.createUser(body);
	}

	@Patch('/:id')
	updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
		return this.usersService.updateUser(parseInt(id), body);
	}

	@Delete('/:id')
	removeUser(@Param('id') id: string) {
		return this.usersService.removeUser(parseInt(id));
	}
}
