import cinesyncFetch from './fetch';

export const getLists = async ({
	token,
}: {
	token: string;
}): Promise<ListsReturnDto> => {
	return await cinesyncFetch({
		token,
		method: 'GET',
		endpoint: '/lists',
	});
};

export const getListById = async ({
	token,
	listId,
}: {
	token: string;
	listId: string;
}): Promise<ListReturnDto> => {
	return await cinesyncFetch({
		token,
		method: 'GET',
		endpoint: `/lists/list`,
		queryParams: [{ key: 'listId', value: listId }],
	});
};

export const getListSharees = async ({
	token,
	listId,
}: {
	token: string;
	listId: string;
}): Promise<ShareeReturnDto> => {
	return await cinesyncFetch({
		token,
		method: 'GET',
		endpoint: `/lists/sharees`,
		queryParams: [{ key: 'listId', value: listId }],
	});
};

export const createList = async ({
	token,
	body,
}: {
	token: string;
	body: CreateListDto;
}): Promise<ListReturnDto> => {
	return await cinesyncFetch({
		token,
		method: 'POST',
		endpoint: '/lists/create',
		body: JSON.stringify(body),
	});
};

export const toggleListSharee = async ({
	token,
	listId,
	email,
}: {
	token: string;
	listId: string;
	email: string;
}): Promise<EmptyReturnDto> => {
	return await cinesyncFetch({
		token,
		method: 'POST',
		endpoint: '/lists/toggleShare',
		body: JSON.stringify({ listId: listId, email: email }),
	});
};

export const createComment = async ({
	token,
	body,
}: {
	token: string;
	body: CreateCommentDto;
}): Promise<EmptyReturnDto> => {
	return await cinesyncFetch({
		token,
		method: 'POST',
		endpoint: '/lists/comments',
		body: JSON.stringify(body),
	});
};

export const toggleListPrivacy = async ({
	token,
	listId,
}: {
	token: string;
	listId: string;
}): Promise<EmptyReturnDto> => {
	return await cinesyncFetch({
		token,
		method: 'PATCH',
		endpoint: `/lists/updatePrivacy`,
		body: JSON.stringify({ listId: listId }),
	});
};

export const updateList = async ({
	token,
	body,
}: {
	token: string;
	body: UpdateListDto;
}): Promise<ListReturnDto> => {
	return await cinesyncFetch({
		token,
		method: 'PATCH',
		endpoint: `/lists/update`,
		body: JSON.stringify(body),
	});
};

export const updateComment = async ({
	token,
	body,
}: {
	token: string;
	body: UpdateCommentDto;
}): Promise<EmptyReturnDto> => {
	return await cinesyncFetch({
		token,
		method: 'PATCH',
		endpoint: `/lists/comments/update`,
		body: JSON.stringify(body),
	});
};

export const deleteList = async ({
	token,
	listId,
}: {
	token: string;
	listId: string;
}): Promise<EmptyReturnDto> => {
	return await cinesyncFetch({
		token,
		method: 'DELETE',
		endpoint: `/lists/delete`,
		body: JSON.stringify({ listId: listId }),
	});
};

export const deleteListMovie = async ({
	token,
	listId,
	movieId,
}: {
	token: string;
	listId: string;
	movieId: string;
}): Promise<EmptyReturnDto> => {
	return await cinesyncFetch({
		token,
		method: 'DELETE',
		endpoint: '/lists/deleteMovie',
		body: JSON.stringify({ listId: listId, movieId: movieId }),
	});
};

export const deleteComment = async ({
	token,
	listId,
	commentId,
}: {
	token: string;
	listId: string;
	commentId: string;
}): Promise<EmptyReturnDto> => {
	return await cinesyncFetch({
		token,
		method: 'DELETE',
		endpoint: '/lists/comments/delete',
		body: JSON.stringify({ listId: listId, commentId: commentId }),
	});
};
