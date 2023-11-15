import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';
import { ListCacheDto } from '../lists/dtos/list-cache.dto';

// let redisUrl: string;

@Injectable()
export class CacheService {
	private readonly redisClient: Redis;
	constructor(private readonly configService: ConfigService) {
		// redisUrl = this.configService.get<string>('REDIS_URL') as string;
		// console.log(`CacheService  constructor  redisUrl:`, redisUrl);
		// this.redisClient = new Redis(
		// 	'redis://@BarelyAnInconvenience@@127.0.0.1:6379',
		// );

		const redisUrl = 'redis://@127.0.0.1:6379';
		console.log(`CacheService constructor redisUrl:`, redisUrl);

		this.redisClient = new Redis(redisUrl);
	}

	async get(key: string) {
		return await this.redisClient.get(key);
	}

	async set(key: string, data: ListCacheDto) {
		await this.redisClient.set(key, JSON.stringify(data));
	}

	async del(key: string) {
		await this.redisClient.del(key);
	}
}
