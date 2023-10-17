import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '@prisma/client';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { EmailService } from '../email/email.service';
import { EmailModule } from '../email/email.module';
import { CreateUserDto } from './dtos/create-user.dto';
import { ListsService } from '../lists/lists.service';
import { ListsModule } from '../lists/lists.module';

describe('UsersController', () => {
	let controller: UsersController;
	let fakeUsersService: Partial<UsersService>;
	let fakeAuthService: Partial<AuthService>;
	let fakeEmailService: Partial<EmailService>;
	let fakeListsService: Partial<ListsService>;

	beforeEach(async () => {
		fakeUsersService = {
			getUser: (id: string) => {
				return Promise.resolve({
					id,
					username: 'testuser',
					email: 'test@test.test',
					password: 'test',
					created_at: new Date(),
					updated_at: new Date(),
				} as User);
			},
			getUserByEmail: (email: string) => {
				return Promise.resolve({
					id: '-1',
					username: 'testuser',
					email,
					password: 'test',
					created_at: new Date(),
					updated_at: new Date(),
				} as User);
			},
			deleteUser: (id: string) => {
				if (id === '-1') {
					const removedUser = {
						id,
						username: 'testuser',
						email: 'test@test.test',
						password: 'test',
						created_at: new Date(),
						updated_at: new Date(),
					} as User;
					return Promise.resolve(removedUser);
				} else {
					throw new NotFoundException();
				}
			},
		};
		fakeAuthService = {
			signup: (createUser: CreateUserDto) => {
				return Promise.resolve({ id: '-1', ...createUser } as User);
			},
			validateUser: (username: string, email: string) => {
				return Promise.resolve({ id: '-1', username, email } as User);
			},
		};
		fakeEmailService = {
			sendSignupEmail: () => {
				return Promise.resolve();
			},
			sendAccountDeletionEmail: () => {
				return Promise.resolve();
			},
		};
		fakeListsService = {
			getLists: (id: string) => {
				return Promise.resolve({
					id,
					username: 'asdf',
					email: 'asdf@asdf.asdf',
					password: '123',
					created_at: new Date(),
					updated_at: new Date(),
					role: 'USER',
					List: [
						{
							id: 25,
							name: 'My Watchlist_chrischris',
							is_private: true,
							creator_id: '123',
							created_at: new Date(),
							updated_at: new Date(),
							Movie: [
								{
									id: 1,
									title: 'Movie2',
									description: 'Description for Movie 2',
									genre: ['Horror', 'Family'],
									release_year: 666,
								},
							],
						},
					],
				});
			},
			deleteList: (listId: number, userId: string) => {
				return Promise.resolve({
					id: userId,
					username: 'asdf',
					email: 'asdf@asdf.asdf',
					password: userId,
					created_at: new Date(),
					updated_at: new Date(),
					role: 'USER',
				});
			},
		};

		const module: TestingModule = await Test.createTestingModule({
			controllers: [UsersController],
			providers: [
				// for all dependencies requiring UsersService, use fake one instead
				{
					provide: UsersService,
					useValue: fakeUsersService,
				},
				{
					provide: AuthService,
					useValue: fakeAuthService,
				},
				{
					provide: EmailService,
					useValue: fakeEmailService,
				},
				{
					provide: ListsService,
					useValue: fakeListsService,
				},
			],
			imports: [EmailModule, ListsModule],
		}).compile();

		controller = module.get<UsersController>(UsersController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});

	it('fetchUserByEmail returns a user with the given email', async () => {
		const user = await controller.fetchUserByEmail('test@test.test');

		expect(user).toBeDefined();
		expect(user?.email).toEqual('test@test.test');
	});

	it('fetchUserById returns a user with the given id', async () => {
		const user = await controller.fetchUserById('-1');

		expect(user).toBeDefined();
		expect(user?.id).toEqual('-1');
	});

	it('fetchUserById throws an error if user with given id is not found', async () => {
		fakeUsersService.getUser = () => Promise.reject(new NotFoundException());

		await expect(controller.fetchUserById('-1')).rejects.toThrow(
			NotFoundException,
		);
	});

	it('signin updates session object and returns user', async () => {
		const session = { userId: '-2' };
		const user = await controller.signin(
			{ email: 'test@test.test', password: 'test' },
			session,
		);

		expect(user.id).toEqual('-1');
		expect(session.userId).toEqual('-1');
	});

	it('signin updates session object and returns user', async () => {
		const session = { userId: '-2' };
		const user = await controller.signin(
			{ email: 'test@test.test', password: 'test' },
			session,
		);

		expect(user.id).toEqual('-1');
		expect(session.userId).toEqual('-1');
	});

	it('signin throws an error if invalid credentials are provided', async () => {
		fakeAuthService.validateUser = () => {
			return Promise.reject(new BadRequestException());
		};

		await expect(
			controller.signin(
				{ email: 'invalid@test.test', password: 'invalid' },
				{},
			),
		).rejects.toThrow(BadRequestException);
	});

	it('signup creates a new user and returns it', async () => {
		const user = await controller.signup(
			{
				username: 'newuser',
				email: 'newuser@test.test',
				password: 'newpassword',
			},
			{},
		);

		expect(user).toBeDefined();
		expect(user.id).toEqual('-1');
	});
});
