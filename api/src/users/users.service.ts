import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserDao } from './daos/user.dao';
import { Response } from 'express';

export type FriendStatus = 'ACCEPT' | 'REJECT' | 'SENT' | 'PENDING';

@Injectable()
export class UsersService {
	constructor(private userDao: UserDao) {}

	async getUser(userId: string) {
		return await this.userDao.getUser(userId);
	}

	async getUserByUsername(username: string) {
		return await this.userDao.getUserByUsername(username);
	}

	async getUserByEmail(userEmail: string) {
		return await this.userDao.getUserByEmail(userEmail);
	}

	async getUsernameById(userId: string) {
		return await this.userDao.getUsernameById(userId);
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

	async getFriends(userId: string) {
		const { user1, user2 } = await this.userDao.getFriends(userId);

		// creating array of all friends
		const friends = user1.map((user) => {
			let status = 'SENT';

			const possibleFriend = user2.find(
				(user_2) => user_2.userId1 === user.userId2,
			);

			if (possibleFriend?.isFriend && user?.isFriend) {
				status = 'ACCEPT';
			} else if (!possibleFriend?.isFriend && !user?.isFriend) {
				status = 'REJECT';
			} else if (!user.isFriend) {
				// if the user is not currently their friend, set status to PENDING
				// indicating they need to accept a friend request
				status = 'PENDING';
			}

			// returning STATUS based on above condition
			return { user: user.userId2, status };
		});

		// attaching username to return array
		return Promise.all(
			friends.map(async (friend) => {
				const { username } = await this.getUser(friend.user);

				return { username, status: friend.status };
			}),
		);
	}

	async createUser(createUser: CreateUserDto) {
		return await this.userDao.createUser(createUser);
	}

	async sendFriendRequest(userId: string, newFriend: string) {
		const { id } = await this.userDao.getUserByUsername(newFriend);

		try {
			await this.userDao.createFriendship(userId, id);
		} catch (error) {
			// throwing p2002, already caught in filter
			throw new BadRequestException('Friendship already exists');
		}
	}

	async updateFriendship(
		userId: string,
		newFriend: string,
		status: FriendStatus,
	) {
		const { id } = await this.userDao.getUserByUsername(newFriend);

		await this.userDao.updateFriendship(userId, id, status);
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
