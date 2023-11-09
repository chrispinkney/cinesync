import { Injectable } from '@nestjs/common';
import { CreateListDto } from './dtos/create-list.dto';
import { UpdateListDto } from './dtos/update-list.dto';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { UpdateCommentDto } from './dtos/update-comment.dto';
import { ListsDao } from './daos/list.dao';
import { UsersDao } from '../users/daos/user.dao';
import { CommentDao } from './daos/comment.dao';
import { UsersService } from '../users/users.service';
import { EmailService } from '../email/email.service';
import { CloneListDto } from './dtos/clone-list.dto';

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
		private listsDao: ListsDao,
		private commentDao: CommentDao,
		private usersDao: UsersDao,
		private usersService: UsersService,
		private emailService: EmailService,
	) {}

	async getPublicList(listId: string) {
		return await this.listsDao.getPublicList(listId);
	}

	async getList(listId: string) {
		const list = await this.listsDao.getList(listId);

		// if a list has comments add username to each comment
		if (list?.comments.length > 0) {
			const updatedComment = await Promise.all(
				list.comments.map(async (comment) => {
					const username = await this.usersService.getUsernameById(
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
		return await this.listsDao.getLists(userId);
	}

	async getWatchedMovies(userId: string) {
		const watched = await this.listsDao.getWatchedMovies(userId);

		const movieIDs = watched.movie.map((movie) => movie.id);

		return movieIDs;
	}

	async getSharees(listId: string, userId: string) {
		const list = await this.listsDao.getList(listId);
		const sharees = await this.listsDao.getSharees(listId);
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
		return await this.listsDao.createList(createList, userId);
	}

	async cloneList(cloneList: CloneListDto, userId: string) {
		const originalList = await this.listsDao.getList(cloneList.listId);

		const clonedListData = {
			name: cloneList.name,
			movie: originalList.movie.map((movie) => ({
				title: movie.title,
				description: movie.description,
				genre: [...movie.genre],
				releaseDate: movie.releaseDate,
				posterUrl: movie.posterUrl,
				rating: movie.rating,
				imdbId: movie.imdbId,
			})),
		};

		const clonedList = await this.listsDao.createList(clonedListData, userId);

		return clonedList;
	}

	async createComment(createCommentDto: CreateCommentDto, userId: string) {
		const comment = await this.commentDao.createComment(
			createCommentDto.listId,
			userId,
			createCommentDto.text,
		);

		const list = await this.listsDao.getList(comment.listId);
		const listOwner = await this.usersDao.getUser(list.creatorId);
		const commenter = await this.usersDao.getUser(userId);

		// don't fire email if the comment is made by the list creator
		if (list.creatorId !== commenter.id) {
			await this.emailService.sendListCommentEmail(
				listOwner.email,
				list,
				commenter.username,
			);
		}

		return comment;
	}

	async updateListPrivacy(listId: string) {
		return await this.listsDao.updateListPrivacy(listId);
	}

	async updateList(updateListDto: UpdateListDto) {
		return await this.listsDao.updateList(updateListDto);
	}

	async updateWatchedStatus(movieId: string, userId: string) {
		return await this.listsDao.updateWatchedStatus(movieId, userId);
	}

	async updateComment(updateCommentDto: UpdateCommentDto) {
		return await this.commentDao.updateComment(
			updateCommentDto.commentId,
			updateCommentDto.text,
		);
	}

	async deleteList(listId: string, userId: string) {
		const user = await this.usersDao.getUser(userId);
		return await this.listsDao.deleteList(listId, user);
	}

	async deleteListItem(listId: string, movieId: string) {
		return await this.listsDao.deleteListItem(listId, movieId);
	}

	async deleteComment(commentId: string) {
		return await this.commentDao.deleteComment(commentId);
	}

	async toggleShareList(listId: string, shareeEmail: string, userId: string) {
		const list = await this.listsDao.getList(listId);
		const user = await this.usersDao.getUser(userId);
		const sharee = await this.usersDao.getUserByEmail(shareeEmail);

		await this.emailService.sendListSharingEmail([user, sharee], list);

		return await this.listsDao.toggleShareList(listId, shareeEmail);
	}

	async toggleShareByUsername(listId: string, username: string) {
		const { email } = await this.usersDao.getUserByUsername(username);

		return this.listsDao.toggleShareList(listId, email);
	}
}
