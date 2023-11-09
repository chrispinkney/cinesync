import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersDao } from '../daos/user.dao';
import { AvatarDao } from '../daos/avatar.dao';
import { Response } from 'express';

@Injectable()
export class AvatarService {
	constructor(private usersDao: UsersDao, private avatarDao: AvatarDao) {}

	private async fetchAvatar(userId: string, res: Response) {
		const { avatar } = await this.avatarDao.getAvatar(userId);

		if (!avatar) {
			throw new NotFoundException('No avatar found');
		}

		res.writeHead(200, {
			'Content-Type': 'image/jpeg',
			'Content-Length': avatar.length,
		});

		res.end(avatar);

		return res;
	}

	async getAvatarByUsername(username: string, res: Response) {
		const user = await this.usersDao.getUserByUsername(username);
		return this.fetchAvatar(user.id, res);
	}

	async getAvatar(userId: string, res: Response) {
		return this.fetchAvatar(userId, res);
	}

	async updateAvatar(userId: string, avatar: Express.Multer.File) {
		const avatarData = avatar?.buffer;
		await this.avatarDao.updateAvatar(userId, avatarData);
	}

	async deleteUserAvatar(userId: string) {
		return await this.avatarDao.deleteUserAvatar(userId);
	}
}
