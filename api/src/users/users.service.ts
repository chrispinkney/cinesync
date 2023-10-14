import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserDao } from '../dao/user.dao';

@Injectable()
export class UsersService {
	constructor(private userDao: UserDao) {}

	async getUser(id: string) {
		return await this.userDao.getUser(id);
	}

	async getUserByEmail(email: string) {
		return await this.userDao.getUserByEmail(email);
	}

	async createUser(createUser: CreateUserDto) {
		return await this.userDao.createUser(createUser);
	}

	async updateUser(id: string, attrs: Partial<CreateUserDto>) {
		return await this.userDao.updateUser(id, attrs);
	}

	async deleteUser(id: string) {
		return await this.userDao.deleteUser(id);
	}
}
