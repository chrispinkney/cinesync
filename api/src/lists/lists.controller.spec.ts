import { Test, TestingModule } from '@nestjs/testing';
import { ListsController } from './lists.controller';

describe.skip('ListsController', () => {
	let controller: ListsController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [ListsController],
		}).compile();

		controller = module.get<ListsController>(ListsController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
