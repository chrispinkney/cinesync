import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ListsModule } from './lists/lists.module';
import { PrismaService } from './prisma/prisma.service';

@Module({
	imports: [ConfigModule.forRoot(), UsersModule, ListsModule],
	controllers: [AppController],
	providers: [AppService, PrismaService],
})
export class AppModule {}
