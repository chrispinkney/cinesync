import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateListDto } from '../dtos/update-list.dto';
import { CreateListDto } from '../dtos/create-list.dto';

@Injectable()
export class ListDao {
	constructor(private readonly prisma: PrismaService) {}

	async getPublicList(listId: string) {
		const list = await this.getList(listId);

		if (!list.isPrivate) {
			return list;
		}

		throw new BadRequestException('List is private');
	}

	async getList(listId: string) {
		const list = await this.prisma.list.findUniqueOrThrow({
			where: { id: listId },
			select: {
				id: true,
				name: true,
				isPrivate: true,
				creatorId: true,
				createdAt: true,
				updatedAt: true,
				movie: true,
				user: true,
				comments: {
					select: {
						id: true,
						text: true,
						authorId: true,
						createdAt: true,
						updatedAt: true,
					},
					orderBy: {
						createdAt: 'asc',
					},
				},
			},
		});

		list.user = list.user.filter((user) => user.id === list.creatorId);

		return list;
	}

	async getLists(userId: string) {
		return this.prisma.user.findUniqueOrThrow({
			where: { id: userId },
			include: {
				list: {
					orderBy: {
						createdAt: 'desc',
					},
					select: {
						id: true,
						name: true,
						isPrivate: true,
						creatorId: true,
						createdAt: true,
						updatedAt: true,
						movie: true,
					},
				},
			},
		});
	}

	async getSharees(listId: string) {
		const list = await this.prisma.list.findUniqueOrThrow({
			where: { id: listId },
			include: {
				user: {
					orderBy: {
						username: 'asc',
					},
					select: {
						id: true,
						username: true,
						email: true,
					},
				},
			},
		});

		return list;
	}

	async getWatchedMovies(userId: string) {
		return await this.prisma.user.findUniqueOrThrow({
			where: {
				id: userId,
			},
			select: {
				movie: {
					select: {
						id: true,
					},
				},
			},
		});
	}

	async createList(createList: CreateListDto, userId: string) {
		let newMovies;
		const list = await this.prisma.list.create({
			data: {
				name: createList.name,
				isPrivate: true,
				creatorId: userId,
				user: {
					connect: { id: userId },
				},
			},
			include: {
				movie: true,
			},
		});

		if (createList?.movie?.length) {
			// iterate over new movies, get new ids
			newMovies = await Promise.all(
				createList.movie.map((movie) =>
					this.prisma.movie.upsert({
						where: { title: movie.title },
						create: {
							title: movie.title,
							description: movie.description,
							genre: movie.genre,
							releaseDate: movie.releaseDate,
							posterUrl: movie.posterUrl,
							rating: movie.rating,
							imdbId: movie.imdbId,
						},
						update: {},
					}),
				),
			);

			// associate ids to movie table
			await Promise.all(
				newMovies.map((movie) =>
					this.prisma.movie.update({
						where: { id: movie.id },
						data: {
							list: {
								connect: {
									id: list.id,
								},
							},
						},
					}),
				),
			);
		}

		const createdList = await this.prisma.list.findUniqueOrThrow({
			where: { id: list.id },
			include: {
				movie: true,
			},
		});

		return createdList;
	}

	async updateListPrivacy(listId: string) {
		const list = await this.prisma.list.findUniqueOrThrow({
			where: { id: listId },
			include: { user: true, movie: true },
		});

		return await this.prisma.list.update({
			where: { id: listId },
			data: {
				isPrivate: !list.isPrivate,
			},
		});
	}

	async updateList(updateListDto: UpdateListDto) {
		let newMovies = [];
		// add new movies to list
		if (updateListDto?.movie?.length) {
			// iterate over new movies, get new ids
			newMovies = await Promise.all(
				updateListDto.movie.map((movie) =>
					this.prisma.movie.upsert({
						where: { title: movie.title },
						create: {
							title: movie.title,
							description: movie.description,
							genre: movie.genre,
							releaseDate: movie.releaseDate,
							posterUrl: movie.posterUrl,
							rating: movie.rating,
							imdbId: movie.imdbId,
						},
						// do not update the movie table
						update: {},
					}),
				),
			);

			// associate ids
			await Promise.all(
				newMovies.map((movie) =>
					this.prisma.movie.update({
						where: { id: movie.id },
						data: {
							list: {
								connect: {
									id: updateListDto.listId,
								},
							},
						},
					}),
				),
			);
		}

		return await this.prisma.list.update({
			where: { id: updateListDto.listId },
			data: {
				name: updateListDto.name,
			},
			include: { movie: true },
		});
	}

	async updateWatchedStatus(movieId: string, userId: string) {
		const user = await this.getWatchedMovies(userId);

		const hasWatched = user.movie.find(
			(watchedMovie) => watchedMovie.id === movieId,
		);

		return await this.prisma.user.update({
			where: { id: userId },
			data: {
				movie: {
					...(hasWatched
						? {
								disconnect: { id: movieId },
						  }
						: {
								connect: { id: movieId },
						  }),
				},
			},
		});
	}

	async deleteList(listId: string, userId: string) {
		const list = await this.prisma.list.findUniqueOrThrow({
			where: { id: listId },
			select: { creatorId: true },
		});

		// if the list isnt owned by the user (i.e., shared) do not delete it
		if (list.creatorId === userId) {
			await this.prisma.user.update({
				where: { id: userId },
				data: {
					list: {
						disconnect: { id: listId },
					},
				},
			});

			return await this.prisma.list.delete({
				where: { id: listId },
			});
		}
	}

	async deleteListItem(listId: string, movieId: string) {
		await this.prisma.list.update({
			where: { id: listId },
			data: {
				movie: {
					disconnect: { id: movieId },
				},
			},
		});
	}

	async toggleShareList(listId: string, email: string) {
		const user = await this.prisma.user.findUniqueOrThrow({
			where: { email },
			include: {
				list: {
					where: {
						id: listId,
					},
					include: {
						movie: true,
					},
				},
			},
		});

		const isConnected = user.list.some((list) => list.id === listId);

		// if a list is being shared with a user
		if (!isConnected) {
			await this.prisma.list.findUniqueOrThrow({
				where: { id: listId },
				include: { movie: true },
			});
		}

		return await this.prisma.list.update({
			where: { id: listId },
			data: {
				user: {
					...(isConnected
						? {
								disconnect: { email },
						  }
						: {
								connect: { email },
						  }),
				},
			},
		});
	}
}
