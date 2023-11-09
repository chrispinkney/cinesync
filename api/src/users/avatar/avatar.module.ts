import { Module } from '@nestjs/common';
import { UsersDao } from '../daos/user.dao';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
	imports: [PrismaModule],
	providers: [UsersDao],
})
export class AvatarModule {}
