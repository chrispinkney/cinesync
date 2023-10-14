import { ArgumentsHost, Catch, HttpStatus, Logger } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter extends BaseExceptionFilter {
	private readonly logger = new Logger(PrismaClientExceptionFilter.name);

	catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		const message = exception.message.replace(/\n/g, '');
		this.logger.error(exception.message);

		switch (exception.code) {
			case 'P2002': {
				const status = HttpStatus.CONFLICT;
				response.status(status).send({
					statusCode: status,
					message: 'Email already in use',
				});
				break;
			}
			// "An operation failed because it depends on one or more records that were required but not found. {cause}"
			case 'P2025': {
				const status = HttpStatus.NOT_FOUND;
				response.status(status).send({
					statusCode: status,
					message,
				});
				break;
			}
			default:
				// default 500 error code
				super.catch(exception, host);
				break;
		}
	}
}
