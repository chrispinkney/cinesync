import {
	Injectable,
	InternalServerErrorException,
	NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserDao } from '../dao/user.dao';

@Injectable()
export class UsersService {
	constructor(private userDao: UserDao) {}

	async getUser(id: string) {
		try {
			const user = await this.userDao.getUser(id);

			if (!user) {
				throw new NotFoundException('User not found');
			}

			return user;
		} catch (error) {
			throw new InternalServerErrorException('Failed to get user by id');
		}
	}

	async getUserByEmail(email: string) {
		try {
			return await this.userDao.getUserByEmail(email);
		} catch (error) {
			throw new InternalServerErrorException('Failed to get user by email');
		}
	}

	async createUser(createUser: CreateUserDto) {
		try {
			return await this.userDao.createUser(createUser);
		} catch (error) {
			throw new InternalServerErrorException('Failed to create user');
		}
	}

	async updateUser(id: string, attrs: Partial<CreateUserDto>) {
		try {
			return await this.userDao.updateUser(id, attrs);
		} catch (error) {
			throw new InternalServerErrorException('Failed to update user');
		}
	}

	async deleteUser(id: string) {
		try {
			const user = await this.userDao.getUser(id);

			if (!user) {
				throw new NotFoundException('User not found');
			}

			return await this.userDao.deleteUser(id);
		} catch (error) {
			throw new InternalServerErrorException('Failed to delete user');
		}
	}
}
