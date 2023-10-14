import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateListDto } from '../lists/dtos/update-list.dto';
import { CreateListDto } from '../lists/dtos/create-list.dto';

@Injectable()
export class ListDao {
	constructor(private readonly prisma: PrismaService) {}

	async getList(listId: number) {
		return await this.prisma.list.findUnique({
			where: { id: listId },
			select: {
				id: true,
				name: true,
				is_private: true,
				creator_id: true,
				created_at: true,
				updated_at: true,
				Movie: true,
				User: true,
			},
		});
	}

	async getLists(userId: string) {
		return this.prisma.user.findUnique({
			where: { id: userId },
			include: {
				List: {
					select: {
						id: true,
						name: true,
						is_private: true,
						creator_id: true,
						created_at: true,
						updated_at: true,
						Movie: true,
					},
				},
			},
		});
	}

	async createList(createList: CreateListDto, userId: string) {
		const list = await this.prisma.list.create({
			data: {
				name: createList.name,
				is_private: true,
				creator_id: userId,
				User: {
					connect: { id: userId },
				},
			},
			include: {
				Movie: true,
			},
		});

		if (createList?.Movie?.length) {
			// iterate over new movies, get new ids
			const newMovies = await Promise.all(
				createList.Movie.map((movie) =>
					this.prisma.movie.upsert({
						where: { title: movie.title },
						create: {
							title: movie.title,
							description: movie.description,
							genre: movie.genre,
							release_year: movie.release_year,
						},
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
							List: {
								connect: {
									id: list.id,
								},
							},
						},
					}),
				),
			);
		}

		const createdList = await this.prisma.list.findUnique({
			where: { id: list.id },
			include: {
				Movie: true,
			},
		});

		return createdList;
	}

	async updateListPrivacy(listId: number, userId: string) {
		const list = await this.prisma.list.findUnique({
			where: { id: listId },
			include: { User: true, Movie: true },
		});

		if (!list) {
			return null;
		}

		if (list.creator_id === userId && (list.name || list.is_private)) {
			const updatedList = await this.prisma.list.update({
				where: { id: listId },
				data: {
					is_private: !list.is_private,
				},
			});

			return updatedList;
		}

		return `You do not have permission to make list ${listId} private.`;
	}

	async updateList(
		listId: number,
		updateListDto: UpdateListDto,
		userId: string,
	) {
		const list = await this.prisma.list.findUnique({
			where: { id: listId },
			include: { User: true, Movie: true },
		});

		if (!list) {
			return null;
		}

		let newMovies = [];
		// add new movies to list
		if (updateListDto?.Movie?.length) {
			// iterate over new movies, get new ids
			newMovies = await Promise.all(
				updateListDto.Movie.map((movie) =>
					this.prisma.movie.upsert({
						where: { title: movie.title },
						create: {
							title: movie.title,
							description: movie.description,
							genre: movie.genre,
							release_year: movie.release_year,
						},
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
							List: {
								connect: {
									id: listId,
								},
							},
						},
					}),
				),
			);
		}

		// update name, is_private only if they have values & the user is the creator
		let updatedList;
		if (list.creator_id === userId && (list.name || list.is_private)) {
			updatedList = await this.prisma.list.update({
				where: { id: listId },
				data: {
					name: list.name,
					is_private: list.is_private,
				},
				include: { Movie: true },
			});
		}

		return updatedList;
	}

	async deleteList(listId: number, userId: string) {
		const list = await this.prisma.list.findUnique({
			where: { id: listId },
			include: {
				User: {
					where: {
						id: userId,
					},
				},
			},
		});

		if (list?.creator_id === userId) {
			await this.prisma.user.update({
				where: { id: userId },
				data: {
					List: {
						delete: {
							id: listId,
							creator_id: userId,
						},
					},
				},
			});

			return `list with ID ${listId} has been deleted`;
		} else {
			return `You do not have permission to delete list with ID ${listId}`;
		}
	}

	async deleteListItem(listId: number, movieId: number, userId: string) {
		const list = await this.prisma.list.findUnique({
			where: { id: listId },
			include: {
				User: {
					where: {
						id: userId,
					},
				},
			},
		});

		if (list?.User) {
			await this.prisma.list.update({
				where: { id: list.id },
				data: {
					Movie: {
						disconnect: { id: movieId },
					},
				},
			});

			return `Movie with ID ${movieId} has been removed`;
		} else {
			return `You do not have permission to update list with ID ${listId}`;
		}
	}

	async shareListByEmail(listId: number, email: string, userId: string) {
		const sharee = await this.prisma.user.findUnique({
			where: { email },
		});

		const list = await this.prisma.list.findUnique({
			where: { id: listId },
			include: {
				User: {
					where: {
						id: userId,
					},
				},
			},
		});

		if (list?.creator_id === userId) {
			await this.prisma.list.update({
				where: { id: listId },
				data: {
					User: {
						connect: [{ id: sharee?.id }],
					},
				},
			});
			return `list with ID ${listId} has been shared with ${email}`;
		} else {
			return `You do not have permission to share list with ID ${listId}`;
		}
	}

	async shareListById(listId: number, recipientId: string, userId: string) {
		const list = await this.prisma.list.findUnique({
			where: { id: listId },
			include: {
				User: {
					where: {
						id: userId,
					},
				},
			},
		});

		if (list?.creator_id === userId) {
			await this.prisma.list.update({
				where: { id: listId },
				data: {
					User: {
						connect: [{ id: recipientId }],
					},
				},
			});
			return `list with ID ${listId} has been shared with ${recipientId}`;
		} else {
			return `You do not have permission to share list with ID ${listId}`;
		}
	}

	async unshareListById(listId: number, recipientId: string, userId: string) {
		const list = await this.prisma.list.findUnique({
			where: { id: listId },
			include: {
				User: {
					where: {
						id: userId,
					},
				},
			},
		});

		if (list?.creator_id === userId) {
			await this.prisma.list.update({
				where: { id: listId },
				data: {
					User: {
						disconnect: [{ id: recipientId }],
					},
				},
			});
			return `list with ID ${listId} has been unshared with ${recipientId}`;
		} else {
			return `You do not have permission to unshare list with ID ${listId}`;
		}
	}
}
