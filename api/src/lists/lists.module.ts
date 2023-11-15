import { Module } from '@nestjs/common';
import { ListsController } from './lists.controller';
import { ListsService } from './lists.service';
import { UsersService } from '../users/users.service';
import { PrismaModule } from '../prisma/prisma.module';
import { EmailModule } from '../email/email.module';
import { UsersModule } from '../users/users.module';
import { ListsDao } from './daos/list.dao';
import { CommentDao } from './daos/comment.dao';
import { UsersDao } from '../users/daos/user.dao';
import { CacheService } from '../cache/cache.service';
import { ConfigService } from '@nestjs/config';

@Module({
	imports: [PrismaModule, EmailModule, UsersModule],
	controllers: [ListsController],
	providers: [
		ListsService,
		ListsDao,
		CommentDao,
		UsersService,
		UsersDao,
		CacheService,
		ConfigService,
	],
})
export class ListsModule {}
