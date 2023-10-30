import { Module } from '@nestjs/common';
import { ListsController } from './lists.controller';
import { ListsService } from './lists.service';
import { UsersService } from '../users/users.service';
import { PrismaModule } from '../prisma/prisma.module';
import { EmailModule } from '../email/email.module';
import { UsersModule } from '../users/users.module';
import { ListDao } from './daos/list.dao';
import { CommentDao } from './daos/comment.dao';
import { UserDao } from '../users/daos/user.dao';

@Module({
	imports: [PrismaModule, EmailModule, UsersModule],
	controllers: [ListsController],
	providers: [ListsService, ListDao, CommentDao, UsersService, UserDao],
})
export class ListsModule {}
