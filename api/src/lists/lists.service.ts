import {
	Injectable,
	InternalServerErrorException,
	NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateListDto } from './dtos/create-list.dto';
import { UpdateListDto } from './dtos/update-list.dto';

@Injectable()
export class ListsService {
	constructor(private prisma: PrismaService) {}

	async getList(listId: number, userId: string) {
		const list = await this.prisma.user.findUnique({
			where: { id: userId },
			include: {
				List: {
					where: {
						id: listId,
					},
					include: {
						Movie: true,
					},
				},
			},
		});

		return list;
	}

	async getLists(userId: string) {
		const user = await this.prisma.user.findUnique({
			where: { id: userId },
			include: {
				List: {
					include: {
						Movie: true,
					},
				},
			},
		});

		return user;
	}

	async createList(createList: CreateListDto, userId: string) {
		try {
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

			return list;
		} catch (error) {
			throw new InternalServerErrorException('Failed to create list');
		}
	}

	async updateList(
		listId: number,
		updateListDto: UpdateListDto,
		userId: string,
	) {
		try {
			const list = await this.prisma.list.findUnique({
				where: { id: listId },
				include: { User: true, Movie: true },
			});

			if (!list) {
				throw new NotFoundException(`List with ID ${listId} not found`);
			}

			// transaction code goes here??

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
		} catch (error) {
			throw new InternalServerErrorException('Failed to update list');
		}
	}

	async deleteList(listId: number, userId: string) {
		try {
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
		} catch (error) {
			throw new InternalServerErrorException('Failed to delete list');
		}
	}

	async deleteListItem(listId: number, movieId: number, userId: string) {
		try {
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
		} catch (error) {
			throw new InternalServerErrorException('Failed to update list');
		}
	}

	async shareListByEmail(listId: number, email: string, userId: string) {
		try {
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
		} catch (error) {
			throw new InternalServerErrorException('Failed to share list');
		}
	}

	async shareListById(listId: number, recipientId: string, userId: string) {
		try {
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
		} catch (error) {
			throw new InternalServerErrorException('Failed to share list');
		}
	}

	async unshareListById(listId: number, recipientId: string, userId: string) {
		try {
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
		} catch (error) {
			throw new InternalServerErrorException('Failed to unshare list');
		}
	}
}
