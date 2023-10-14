import {
	Injectable,
	InternalServerErrorException,
	NotFoundException,
} from '@nestjs/common';
import { CreateListDto } from './dtos/create-list.dto';
import { UpdateListDto } from './dtos/update-list.dto';
import { ListDao } from '../dao/list.dao';

@Injectable()
export class ListsService {
	constructor(private listDao: ListDao) {}

	async getList(listId: number) {
		try {
			const list = await this.listDao.getList(listId);

			if (!list) {
				throw new NotFoundException(`List with id ${listId} not found`);
			}

			return list;
		} catch (error) {
			throw new InternalServerErrorException('Failed to get list');
		}
	}

	async getLists(userId: string) {
		try {
			return await this.listDao.getLists(userId);
		} catch (error) {
			throw new InternalServerErrorException('Failed to get lists');
		}
	}

	async createList(createList: CreateListDto, userId: string) {
		try {
			return await this.listDao.createList(createList, userId);
		} catch (error) {
			throw new InternalServerErrorException('Failed to create list');
		}
	}

	async updateListPrivacy(listId: number, userId: string) {
		try {
			return await this.listDao.updateListPrivacy(listId, userId);
		} catch (error) {
			throw new InternalServerErrorException('Failed to update list privacy');
		}
	}

	async updateList(
		listId: number,
		updateListDto: UpdateListDto,
		userId: string,
	) {
		try {
			return await this.listDao.updateList(listId, updateListDto, userId);
		} catch (error) {
			throw new InternalServerErrorException('Failed to update list');
		}
	}

	async deleteList(listId: number, userId: string) {
		try {
			return await this.listDao.deleteList(listId, userId);
		} catch (error) {
			throw new InternalServerErrorException('Failed to delete list');
		}
	}

	async deleteListItem(listId: number, movieId: number, userId: string) {
		try {
			return await this.listDao.deleteListItem(listId, movieId, userId);
		} catch (error) {
			throw new InternalServerErrorException('Failed to delete list item');
		}
	}

	async shareListByEmail(listId: number, email: string, userId: string) {
		try {
			return await this.listDao.shareListByEmail(listId, email, userId);
		} catch (error) {
			throw new InternalServerErrorException('Failed to share list by email');
		}
	}

	async shareListById(listId: number, recipientId: string, userId: string) {
		try {
			return await this.listDao.shareListById(listId, recipientId, userId);
		} catch (error) {
			throw new InternalServerErrorException('Failed to share list by id');
		}
	}

	async unshareListById(listId: number, recipientId: string, userId: string) {
		try {
			return await this.listDao.unshareListById(listId, recipientId, userId);
		} catch (error) {
			throw new InternalServerErrorException('Failed to unshare list by id');
		}
	}
}
