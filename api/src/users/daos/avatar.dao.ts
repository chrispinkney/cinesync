import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AvatarDao {
	constructor(private readonly prisma: PrismaService) {}

	async getAvatar(userId: string) {
		const avatar = await this.prisma.avatar.findFirstOrThrow({
			where: { userId },
		});

		return avatar;
	}

	async updateAvatar(userId: string, avatar: Buffer) {
		const { id } = await this.prisma.avatar.upsert({
			where: { userId },
			create: { userId, avatar },
			update: { avatar },
		});

		return id;
	}

	async deleteUserAvatar(userId: string) {
		await this.prisma.avatar.findUniqueOrThrow({
			where: {
				userId,
			},
		});

		return await this.prisma.avatar.delete({
			where: { userId },
		});
	}
}
