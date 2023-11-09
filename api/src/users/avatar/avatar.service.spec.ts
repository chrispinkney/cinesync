import { Test, TestingModule } from '@nestjs/testing';
import { AvatarService } from './avatar.service';
import { UsersDao } from '../daos/user.dao';
import { AvatarDao } from '../daos/avatar.dao';
import { PrismaService } from '../../prisma/prisma.service';

describe('AvatarService', () => {
	let service: AvatarService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [AvatarService, UsersDao, AvatarDao, PrismaService],
		}).compile();

		service = module.get<AvatarService>(AvatarService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
