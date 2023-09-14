import { IsEmail, IsString } from 'class-validator';

export class SigninUserDto {
	@IsEmail()
	email: string;

	@IsString()
	password: string;
}
