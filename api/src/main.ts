import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const address = '0.0.0.0';
const port = 3000;

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	await app.listen(port, address);
}
bootstrap();
