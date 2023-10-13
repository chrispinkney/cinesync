import {
	Injectable,
	InternalServerErrorException,
	NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dtos/create-user.dto';

@Injectable()
export class UsersService {
	constructor(private prisma: PrismaService) {}

	async getUser(id: string) {
		// if an id is not passed return null- used in GET /whoami
		if (!id) {
			return null;
		}

		try {
			const user = await this.prisma.user.findUnique({
				where: { id },
			});

			if (!user) {
				throw new NotFoundException('User not found');
			}

			return user;
		} catch (error) {
			throw new InternalServerErrorException('Failed to get user');
		}
	}

	async getUserByEmail(email: string) {
		try {
			const user = await this.prisma.user.findUnique({
				where: { email },
			});

			return user || null;
		} catch (error) {
			throw new InternalServerErrorException('Failed to get user');
		}
	}

	async createUser(createUser: CreateUserDto) {
		try {
			const user = await this.prisma.user.create({
				data: {
					...createUser,
					role: 'USER',
				},
			});

			return user;
		} catch (error) {
			throw new InternalServerErrorException('Failed to create user');
		}
	}

	async updateUser(id: string, attrs: Partial<CreateUserDto>) {
		try {
			const user = await this.prisma.user.findUnique({
				where: { id },
			});

			if (!user) {
				throw new NotFoundException('User not found');
			}

			const updatedUser = await this.prisma.user.update({
				where: { id },
				data: attrs,
			});

			return updatedUser;
		} catch (error) {
			throw new InternalServerErrorException('Failed to update user');
		}
	}

	async removeUser(id: string) {
		try {
			const user = await this.prisma.user.findUnique({
				where: { id },
			});

			if (!user) {
				throw new NotFoundException('User not found');
			}

			const deletedUser = await this.prisma.user.delete({
				where: { id },
			});

			return deletedUser;
		} catch (error) {
			throw new InternalServerErrorException('Failed to update user');
		}
	}
}
