import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';

describe('UsersService', () => {
	let service: UsersService;
	let fakePrismaService: Partial<PrismaService>;
	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				UsersService,
				// for all dependencies requiring PrismaService, use fake one instead
				{
					provide: PrismaService,
					useValue: fakePrismaService,
				},
			],
		}).compile();

		service = module.get<UsersService>(UsersService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
