import { Module } from '@nestjs/common';
import { ExportController } from './export.controller';
import { ExportService } from './export.service';
import { UsersService } from '../users.service';
import { UsersDao } from '../daos/user.dao';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
	controllers: [ExportController],
	providers: [ExportService, UsersService, UsersDao, PrismaService],
})
export class ExportModule {}
