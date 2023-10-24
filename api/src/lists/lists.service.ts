import { Injectable } from '@nestjs/common';
import { CreateListDto } from './dtos/create-list.dto';
import { UpdateListDto } from './dtos/update-list.dto';
import { ListDao } from '../dao/list.dao';
import { UserDao } from '../dao/user.dao';

@Injectable()
export class ListsService {
	constructor(private listDao: ListDao, private userDao: UserDao) {}

	async getList(listId: string) {
		return await this.listDao.getList(listId);
	}

	async getLists(userId: string) {
		return await this.listDao.getLists(userId);
	}

	async getSharees(listId: string, userId: string) {
		const list = await this.listDao.getSharees(listId);

		const creator = list.User.find((user) => user.id === list.creator_id);

		const filteredList = list.User.filter((user) => userId !== user.id).map(
			({ username, email }) => ({
				username,
				email,
				creator: username === creator?.username,
			}),
		);

		return filteredList;
	}

	async createList(createList: CreateListDto, userId: string) {
		return await this.listDao.createList(createList, userId);
	}

	async updateListPrivacy(listId: string) {
		return await this.listDao.updateListPrivacy(listId);
	}

	async updateList(updateListDto: UpdateListDto) {
		return await this.listDao.updateList(updateListDto);
	}

	async deleteList(listId: string, userId: string) {
		return await this.listDao.deleteList(listId, userId);
	}

	async deleteListItem(listId: string, movieId: string) {
		return await this.listDao.deleteListItem(listId, movieId);
	}

	async toggleShareList(listId: string, email: string) {
		return await this.listDao.toggleShareList(listId, email);
	}

	async toggleShareByUsername(listId: string, username: string) {
		const { email } = await this.userDao.getUserByUsername(username);

		return this.listDao.toggleShareList(listId, email);
	}
}
