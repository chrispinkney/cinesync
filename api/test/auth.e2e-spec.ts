import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from './../src/app.module';
import { INestApplication } from '@nestjs/common';

describe('Authentication System (e2e)', () => {
	let app: INestApplication;

	beforeAll(async () => {
		const moduleFixture = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();
	});

	afterAll(async () => {
		await app.close();
	});

	it('handles a signup and delete request', async () => {
		const username = 'asdf';
		const email = 'asdf@asdf.asdf';

		const res = await request(app.getHttpServer())
			.post('/auth/signup')
			.send({
				username,
				email,
				password: 'asdf',
			})
			.expect(201);

		// delete user after creation
		const cookie = res.headers['set-cookie'];
		const id = res.body.id;

		await request(app.getHttpServer())
			.delete(`/auth/${id}`)
			.set('Cookie', cookie)
			.expect(200);
	});

	it('signup as a new user then get the currently logged in user', async () => {
		const username = 'asdf';
		const email = 'asdf@asdf.com';

		const res = await request(app.getHttpServer())
			.post('/auth/signup')
			.send({
				username,
				email,
				password: 'asdf',
			})
			.expect(201);

		const cookie = res.headers['set-cookie'];
		const id = res.body.id;

		const { body } = await request(app.getHttpServer())
			.get('/auth/whoami')
			.set('Cookie', cookie)
			.expect(200);

		expect(body.id).toEqual(id);
		expect(body.username).toEqual(username);
		expect(body.email).toEqual(email);

		// delete user after creation
		await request(app.getHttpServer())
			.delete(`/auth/${id}`)
			.set('Cookie', cookie)
			.expect(200);
	});
});
