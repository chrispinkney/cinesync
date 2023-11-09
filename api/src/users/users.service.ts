import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersDao } from './daos/user.dao';

export type FriendStatus = 'ACCEPT' | 'REJECT' | 'SENT' | 'PENDING';

@Injectable()
export class UsersService {
	constructor(private usersDao: UsersDao) {}

	async getUser(userId: string) {
		return await this.usersDao.getUser(userId);
	}

	async getUserByUsername(username: string) {
		return await this.usersDao.getUserByUsername(username);
	}

	async getUserByEmail(userEmail: string) {
		return await this.usersDao.getUserByEmail(userEmail);
	}

	async getUsernameById(userId: string) {
		return await this.usersDao.getUsernameById(userId);
	}

	async getUserData(userId: string) {
		return await this.usersDao.getUserData(userId);
	}

	async getFriends(userId: string) {
		const { user1, user2 } = await this.usersDao.getFriends(userId);

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
		return await this.usersDao.createUser(createUser);
	}

	async sendFriendRequest(userId: string, newFriend: string) {
		const { id } = await this.usersDao.getUserByUsername(newFriend);

		try {
			await this.usersDao.createFriendship(userId, id);
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
		const { id } = await this.usersDao.getUserByUsername(newFriend);

		await this.usersDao.updateFriendship(userId, id, status);
	}

	async updateUser(userId: string, attrs: Partial<CreateUserDto>) {
		return await this.usersDao.updateUser(userId, attrs);
	}

	async deleteUser(userId: string) {
		return await this.usersDao.deleteUser(userId);
	}
}
