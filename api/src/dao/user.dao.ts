import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from '../users/dtos/create-user.dto';

@Injectable()
export class UserDao {
	constructor(private readonly prisma: PrismaService) {}

	async getUser(id: string) {
		return await this.prisma.user.findUniqueOrThrow({
			where: { id },
		});
	}

	async getUserByEmail(email: string) {
		return await this.prisma.user.findUniqueOrThrow({
			where: { email },
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

	async updateUser(id: string, attrs: Partial<CreateUserDto>) {
		return await this.prisma.user.update({
			where: { id },
			data: attrs,
		});
	}

	async deleteUser(id: string) {
		return await this.prisma.user.delete({
			where: { id },
		});
	}
}
