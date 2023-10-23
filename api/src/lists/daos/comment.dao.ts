import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CommentDao {
	constructor(private readonly prisma: PrismaService) {}

	async createComment(listId: string, userId: string, text: string) {
		return await this.prisma.comment.create({
			data: {
				text,
				author: { connect: { id: userId } },
				list: { connect: { id: listId } },
			},
		});
	}

	async updateComment(commentId: string, text: string) {
		const list = await this.prisma.comment.update({
			where: {
				id: commentId,
			},
			data: {
				text,
			},
		});

		return list;
	}

	async deleteComment(commentId: string) {
		return await this.prisma.comment.delete({
			where: {
				id: commentId,
			},
		});
	}
}
