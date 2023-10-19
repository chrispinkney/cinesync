import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from '../users/dtos/create-user.dto';

@Injectable()
export class UserDao {
	constructor(private readonly prisma: PrismaService) {}

	async getUser(userId: string) {
		return await this.prisma.user.findUniqueOrThrow({
			where: { id: userId },
		});
	}

	async getUserByEmail(userEmail: string) {
		return await this.prisma.user.findUniqueOrThrow({
			where: { email: userEmail },
		});
	}

	async createUser(createUser: CreateUserDto) {
		return await this.prisma.user.create({
			data: {
				...createUser,
				role: 'USER',
			},
		});
	}

	async updateUser(userId: string, attrs: Partial<CreateUserDto>) {
		return await this.prisma.user.update({
			where: { id: userId },
			data: attrs,
		});
	}

	async updateAvatar(userId: string, avatar: Buffer) {
		await this.prisma.user.update({
			where: { id: userId },
			data: { avatar },
		});
	}

	async deleteUser(userId: string) {
		return await this.prisma.user.delete({
			where: { id: userId },
		});
	}

	async deleteUserAvatar(userId: string) {
		return await this.prisma.user.update({
			where: { id: userId },
			data: { avatar: null },
		});
	}
}
