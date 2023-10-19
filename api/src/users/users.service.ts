import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserDao } from '../dao/user.dao';
import { Response } from 'express';

@Injectable()
export class UsersService {
	constructor(private userDao: UserDao) {}

	async getUser(userId: string) {
		return await this.userDao.getUser(userId);
	}

	async getUserByEmail(userEmail: string) {
		return await this.userDao.getUserByEmail(userEmail);
	}

	async getAvatar(userId: string, res: Response) {
		const user = await this.userDao.getUser(userId);

		if (user?.avatar) {
			const imageData = user.avatar;

			res.writeHead(200, {
				'Content-Type': 'image/jpeg',
				'Content-Length': imageData.length,
			});

			res.end(imageData);
		}

		throw new NotFoundException('Avatar not found');
	}

	async createUser(createUser: CreateUserDto) {
		return await this.userDao.createUser(createUser);
	}

	async updateAvatar(userId: string, avatar: Express.Multer.File) {
		const avatarData = avatar.buffer;
		return await this.userDao.updateAvatar(userId, avatarData);
	}

	async updateUser(userId: string, attrs: Partial<CreateUserDto>) {
		return await this.userDao.updateUser(userId, attrs);
	}

	async deleteUser(userId: string) {
		return await this.userDao.deleteUser(userId);
	}

	async deleteUserAvatar(userId: string) {
		return await this.userDao.deleteUserAvatar(userId);
	}
}
