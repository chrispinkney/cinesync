import {
	Controller,
	Res,
	Req,
	UseGuards,
	Get,
	BadRequestException,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { ExportService } from './export.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('export')
export class ExportController {
	constructor(private exportService: ExportService) {}

	@UseGuards(JwtAuthGuard)
	@Get()
	async exportData(@Req() req: Request, @Res() res: Response) {
		if (!req.user) throw new BadRequestException('req contains no user');

		const userData = await this.exportService.exportUserData(req.user.id);

		res.set({
			'Content-Disposition': `attachment; filename=${
				req.user.username
			}_${new Date().toJSON()}.json`,
			'Content-Type': 'application/json',
		});

		return res.send(userData);
	}
}
