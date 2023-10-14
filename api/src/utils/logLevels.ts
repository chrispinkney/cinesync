import { LogLevel } from '@nestjs/common/services/logger.service';

export const logLevels = (isProduction: boolean): LogLevel[] => {
	if (isProduction) {
		return ['log', 'warn', 'error'];
	}
	return ['error', 'warn', 'log', 'verbose', 'debug'];
};
