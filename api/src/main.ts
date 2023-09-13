import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common/pipes';
import {
	FastifyAdapter,
	NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';

const address = '0.0.0.0';
const port = 3000;

async function bootstrap() {
	const adapter = new FastifyAdapter();
	adapter.enableCors({ origin: true });

	const app = await NestFactory.create<NestFastifyApplication>(
		AppModule,
		adapter,
	);
	app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
	await app.listen(port, address);
}
bootstrap();
