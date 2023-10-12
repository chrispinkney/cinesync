import { Module } from '@nestjs/common';
import { ListsController } from './lists.controller';
import { ListsService } from './lists.service';
import { PrismaModule } from '../prisma/prisma.module';
import { EmailModule } from '../email/email.module';

@Module({
	imports: [PrismaModule, EmailModule],
	controllers: [ListsController],
	providers: [ListsService],
})
export class ListsModule {}
