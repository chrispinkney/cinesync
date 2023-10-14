import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateListDto } from '../lists/dtos/update-list.dto';
import { CreateListDto } from '../lists/dtos/create-list.dto';

@Injectable()
export class ListDao {
	constructor(private readonly prisma: PrismaService) {}

	async getList(listId: number) {
		return await this.prisma.list.findUniqueOrThrow({
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
		return this.prisma.user.findUniqueOrThrow({
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

		const createdList = await this.prisma.list.findUniqueOrThrow({
			where: { id: list.id },
			include: {
				Movie: true,
			},
		});

		return createdList;
	}

	async updateListPrivacy(listId: number) {
		const list = await this.prisma.list.findUniqueOrThrow({
			where: { id: listId },
			include: { User: true, Movie: true },
		});

		return await this.prisma.list.update({
			where: { id: listId },
			data: {
				is_private: !list.is_private,
			},
		});
	}

	async updateList(listId: number, updateListDto: UpdateListDto) {
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

		return await this.prisma.list.update({
			where: { id: listId },
			data: {
				name: updateListDto.name,
				is_private: updateListDto.is_private,
			},
			include: { Movie: true },
		});
	}

	async deleteList(listId: number, userId: string) {
		return await this.prisma.user.update({
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
	}

	async deleteListItem(listId: number, movieId: number) {
		await this.prisma.list.update({
			where: { id: listId },
			data: {
				Movie: {
					disconnect: { id: movieId },
				},
			},
		});
	}

	async toggleShareList(listId: number, email: string) {
		const user = await this.prisma.user.findUniqueOrThrow({
			where: { email },
			include: {
				List: {
					where: {
						id: listId,
					},
				},
			},
		});

		const isConnected = user.List.some((list) => list.id === listId);

		return await this.prisma.list.update({
			where: { id: listId },
			data: {
				User: {
					...(isConnected
						? {
								disconnect: { email },
						  }
						: { connect: { email } }),
				},
			},
		});
	}
}
