import { Module } from '@nestjs/common';
import { ListsController } from './lists.controller';
import { ListsService } from './lists.service';
import { PrismaModule } from '../prisma/prisma.module';
import { EmailModule } from '../email/email.module';
import { ListDao } from '../dao/list.dao';
import { UserDao } from '../dao/user.dao';

@Module({
	imports: [PrismaModule, EmailModule],
	controllers: [ListsController],
	providers: [ListsService, ListDao, UserDao],
})
export class ListsModule {}
