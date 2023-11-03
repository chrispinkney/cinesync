import { Injectable } from '@nestjs/common';
import { CreateListDto } from './dtos/create-list.dto';
import { UpdateListDto } from './dtos/update-list.dto';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { UpdateCommentDto } from './dtos/update-comment.dto';
import { ListDao } from './daos/list.dao';
import { UserDao } from '../users/daos/user.dao';
import { CommentDao } from './daos/comment.dao';
import { UsersService } from '../users/users.service';

interface Comment {
	id: string;
	text: string;
	authorId: string;
	createdAt: Date;
	updatedAt: Date;
	username: string;
}

@Injectable()
export class ListsService {
	constructor(
		private listDao: ListDao,
		private commentDao: CommentDao,
		private userDao: UserDao,
		private userService: UsersService,
	) {}

	async getList(listId: string) {
		const list = await this.listDao.getList(listId);

		// if a list has comments add username to each comment
		if (list?.comments.length > 0) {
			const updatedComment = await Promise.all(
				list.comments.map(async (comment) => {
					const username = await this.userService.getUsernameById(
						comment.authorId,
					);

					const commentWithUsername: Comment = {
						...comment,
						username,
					};

					return commentWithUsername;
				}),
			);

			list.comments = updatedComment;
		}

		return list;
	}

	async getLists(userId: string) {
		return await this.listDao.getLists(userId);
	}

	async getWatchedMovies(userId: string) {
		const watched = await this.listDao.getWatchedMovies(userId);

		const movieIDs = watched.movie.map((movie) => movie.id);

		return movieIDs;
	}

	async getSharees(listId: string, userId: string) {
		const list = await this.listDao.getList(listId);
		const sharees = await this.listDao.getSharees(listId);
		const creator = sharees.user.find((user) => user.id === sharees.creatorId);
		const filteredList = sharees.user.filter((user) => userId !== user.id);

		// retrieve movies watched by each sharee
		const userListDetails = await Promise.all(
			filteredList.map(async (user) => {
				const userMovies = await this.getWatchedMovies(user.id);

				const watchedMoviesOnList = list.movie
					.filter((movie) => userMovies.includes(movie.id))
					.map((movie) => movie.id);

				return {
					username: user.username,
					email: user.email,
					creator: user.username === creator?.username,
					watched: watchedMoviesOnList,
				};
			}),
		);

		return userListDetails;
	}

	async createList(createList: CreateListDto, userId: string) {
		return await this.listDao.createList(createList, userId);
	}

	async createComment(createCommentDto: CreateCommentDto, userId: string) {
		return await this.commentDao.createComment(
			createCommentDto.listId,
			userId,
			createCommentDto.text,
		);
	}

	async updateListPrivacy(listId: string) {
		return await this.listDao.updateListPrivacy(listId);
	}

	async updateList(updateListDto: UpdateListDto) {
		return await this.listDao.updateList(updateListDto);
	}

	async updateWatchedStatus(movieId: string, userId: string) {
		return await this.listDao.updateWatchedStatus(movieId, userId);
	}

	async updateComment(updateCommentDto: UpdateCommentDto) {
		return await this.commentDao.updateComment(
			updateCommentDto.commentId,
			updateCommentDto.text,
		);
	}

	async deleteList(listId: string, userId: string) {
		return await this.listDao.deleteList(listId, userId);
	}

	async deleteListItem(listId: string, movieId: string) {
		return await this.listDao.deleteListItem(listId, movieId);
	}

	async deleteComment(commentId: string) {
		return await this.commentDao.deleteComment(commentId);
	}

	async toggleShareList(listId: string, email: string) {
		return await this.listDao.toggleShareList(listId, email);
	}

	async toggleShareByUsername(listId: string, username: string) {
		const { email } = await this.userDao.getUserByUsername(username);

		return this.listDao.toggleShareList(listId, email);
	}
}
