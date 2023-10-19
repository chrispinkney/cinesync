import { Injectable } from '@nestjs/common';
import { CreateListDto } from './dtos/create-list.dto';
import { UpdateListDto } from './dtos/update-list.dto';
import { ListDao } from '../dao/list.dao';

@Injectable()
export class ListsService {
	constructor(private listDao: ListDao) {}

	async getList(listId: string) {
		return await this.listDao.getList(listId);
	}

	async getLists(userId: string) {
		return await this.listDao.getLists(userId);
	}

	async createList(createList: CreateListDto, userId: string) {
		return await this.listDao.createList(createList, userId);
	}

	async updateListPrivacy(listId: string) {
		return await this.listDao.updateListPrivacy(listId);
	}

	async updateList(listId: string, updateListDto: UpdateListDto) {
		return await this.listDao.updateList(listId, updateListDto);
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
}
