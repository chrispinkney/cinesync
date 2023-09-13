import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ListsModule } from './lists/lists.module';

@Module({
	imports: [UsersModule, ListsModule],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
