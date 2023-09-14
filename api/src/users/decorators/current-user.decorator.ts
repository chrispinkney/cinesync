import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/*	
	this decorator gives us the current user authenticated by the system
	decorators cannot make use of DI thus we need an interceptor.

	the decorator cannot run without first making use of the CurrentUserInterceptor
*/
export const CurrentUser = createParamDecorator(
	(data: never, context: ExecutionContext) => {
		// the current request object passing through the handler
		const request = context.switchToHttp().getRequest();

		return request.currentUser;
	},
);
