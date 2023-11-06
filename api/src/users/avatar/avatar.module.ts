import { Module } from '@nestjs/common';
import { UserDao } from '../daos/user.dao';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
	imports: [PrismaModule],
	providers: [UserDao],
})
export class AvatarModule {}
