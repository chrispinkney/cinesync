import { IsBoolean } from 'class-validator';

export class UpdateListPrivacyDto {
	@IsBoolean()
	is_private: boolean;
}
