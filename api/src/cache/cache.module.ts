import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CacheService } from './cache.service';

@Module({
	providers: [CacheService, ConfigService],
	exports: [CacheService],
})
export class CacheModule {}
