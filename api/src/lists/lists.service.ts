import { Injectable } from '@nestjs/common';
import { CreateListDto } from './dtos/create-list.dto';
import { UpdateListDto } from './dtos/update-list.dto';
import { ListDao } from '../dao/list.dao';

@Injectable()
export class ListsService {
	constructor(private listDao: ListDao) {}

	async getList(listId: number) {
		return await this.listDao.getList(listId);
	}

	async getLists(userId: string) {
		return await this.listDao.getLists(userId);
	}

	async createList(createList: CreateListDto, userId: string) {
		return await this.listDao.createList(createList, userId);
	}

	async updateListPrivacy(listId: number) {
		return await this.listDao.updateListPrivacy(listId);
	}

	async updateList(listId: number, updateListDto: UpdateListDto) {
		return await this.listDao.updateList(listId, updateListDto);
	}

	async deleteList(listId: number, userId: string) {
		return await this.listDao.deleteList(listId, userId);
	}

	async deleteListItem(listId: number, movieId: number) {
		return await this.listDao.deleteListItem(listId, movieId);
	}

	async toggleShareList(listId: number, email: string) {
		return await this.listDao.toggleShareList(listId, email);
	}
}
