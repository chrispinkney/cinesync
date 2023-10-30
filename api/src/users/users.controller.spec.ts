/* eslint-disable @typescript-eslint/no-explicit-any */
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '@prisma/client';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth/auth.service';
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
					createdAt: new Date(),
					updatedAt: new Date(),
				} as User);
			},
			getUserByEmail: (email: string) => {
				return Promise.resolve({
					id: '-1',
					username: 'testuser',
					email,
					password: 'test',
					createdAt: new Date(),
					updatedAt: new Date(),
				} as User);
			},
			deleteUser: (id: string) => {
				if (id === '-1') {
					const removedUser = {
						id,
						username: 'testuser',
						email: 'test@test.test',
						password: 'test',
						createdAt: new Date(),
						updatedAt: new Date(),
					} as User;
					return Promise.resolve(removedUser);
				} else {
					throw new NotFoundException();
				}
			},
		};
		fakeAuthService = {
			login: () => {
				return Promise.reject(new BadRequestException());
			},
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
					createdAt: new Date(),
					updatedAt: new Date(),
					role: 'USER',
					avatar: null,
					list: [
						{
							id: '25',
							name: 'My Watchlist_chrischris',
							isPrivate: true,
							creatorId: '123',
							createdAt: new Date(),
							updatedAt: new Date(),
							movie: [
								{
									id: '1',
									title: 'Movie2',
									description: 'Description for Movie 2',
									genre: ['Horror', 'Family'],
									releaseDate: '666',
									posterUrl: '123',
									rating: 4.5,
									imdbId: '123',
								},
							],
						},
					],
				});
			},
			deleteList: (listId: string, userId: string) => {
				return Promise.resolve({
					id: userId,
					username: 'asdf',
					email: 'asdf@asdf.asdf',
					password: userId,
					createdAt: new Date(),
					updatedAt: new Date(),
					role: 'USER',
					avatar: null,
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

	it.skip('fetchUserByEmail returns a user with the given email', async () => {
		const user = await controller.fetchUserByEmail('test@test.test');

		expect(user).toBeDefined();
		expect(user?.id).toEqual('-1');
		expect(user?.username).toEqual('testuser');
		expect(user?.email).toEqual('test@test.test');
	});

	it.skip('fetchUserById returns a user with the given id', async () => {
		const user = await controller.fetchUserById('-1');

		expect(user).toBeDefined();
		expect(user?.id).toEqual('-1');
	});

	it.skip('fetchUserById throws an error if user with given id is not found', async () => {
		fakeUsersService.getUser = () => Promise.reject(new NotFoundException());

		await expect(controller.fetchUserById('-1')).rejects.toThrow(
			NotFoundException,
		);
	});

	it('signin returns a jwt', async () => {
		const req: any = {
			user: {
				id: '-1',
				username: 'testuser',
				email: 'test@test.test',
				role: 'USER',
			},
		};
		const user = await controller.signin(req);

		expect(user).toBeDefined();
		expect(user.accessToken).toBeDefined();
	});

	it.skip('signin throws an error if invalid credentials are provided', async () => {
		fakeAuthService.login = () => {
			return Promise.reject(new BadRequestException());
		};

		const req: any = {
			user: {
				id: '-1',
				username: 'testuser',
				email: 'test@test.test',
				role: 'USER',
			},
		};

		await expect(controller.signin(req)).rejects.toThrow(BadRequestException);
	});

	it.skip('signup creates a new user and returns it', async () => {
		const user = await controller.signup({
			username: 'newuser',
			email: 'newuser@test.test',
			password: 'newpassword',
		});

		expect(user).toBeDefined();
		expect(user.id).toEqual('-1');
	});
});
