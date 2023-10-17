import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { logLevels } from './utils/logLevels';
import { PrismaClientExceptionFilter } from './prisma/filter/prisma-client-exception.filter';

const address = '0.0.0.0';
const port = 3000;

async function bootstrap() {
	const app = await NestFactory.create(AppModule, {
		logger: logLevels(process.env.NODE_ENV === 'production'),
	});
	app.enableCors({ origin: true, credentials: true });

	const { httpAdapter } = app.get(HttpAdapterHost);
	app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));

	await app.listen(port, address);
}
bootstrap();
