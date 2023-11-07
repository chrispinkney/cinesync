import { Module } from '@nestjs/common';
import { ExportController } from './export.controller';
import { ExportService } from './export.service';
import { UsersService } from '../users.service';
import { UserDao } from '../daos/user.dao';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
	controllers: [ExportController],
	providers: [ExportService, UsersService, UserDao, PrismaService],
})
export class ExportModule {}
