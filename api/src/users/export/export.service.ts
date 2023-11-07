import { Injectable } from '@nestjs/common';
import { UsersService } from '../users.service';

@Injectable()
export class ExportService {
	constructor(private readonly usersService: UsersService) {}

	async exportUserData(userId: string) {
		const data = await this.usersService.getUserData(userId);

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { id, password, role, list, movie, ...userData } = data;

		const exportData = {
			...userData,
			lists: list,
			watched: movie,
		};

		return exportData;
	}
}
