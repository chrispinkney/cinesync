import cinesyncFetch from './fetch';

export const getWhoAmI = async ({
	token,
}: {
	token: string;
}): Promise<UserReturnDto> => {
	return await cinesyncFetch({
		token,
		method: 'GET',
		endpoint: '/auth/whoami',
	});
};

export const getUserById = async ({
	token,
	userId,
}: {
	token: string;
	userId: string;
}): Promise<UserReturnDto> => {
	return await cinesyncFetch({
		token,
		method: 'GET',
		endpoint: '/auth',
		queryParams: [{ key: 'userId', value: userId }],
	});
};

export const getUserByEmail = async ({
	token,
	email,
}: {
	token: string;
	email: string;
}): Promise<UserReturnDto> => {
	return await cinesyncFetch({
		token,
		method: 'GET',
		endpoint: '/auth',
		queryParams: [{ key: 'email', value: email }],
	});
};

export const getUserAvatar = async ({
	token,
}: {
	token: string;
}): Promise<AvatarReturnDto> => {
	return await cinesyncFetch({
		token,
		method: 'GET',
		endpoint: '/auth/avatar/download',
	});
};

export const getAvatarByUsername = async ({
	token,
	username,
}: {
	token: string;
	username: string;
}): Promise<AvatarReturnDto> => {
	return await cinesyncFetch({
		token,
		method: 'GET',
		endpoint: '/auth/avatar',
		queryParams: [{ key: 'username', value: username }],
	});
};

export const signUserOut = async ({
	token,
}: {
	token: string;
}): Promise<EmptyReturnDto> => {
	return await cinesyncFetch({
		token,
		method: 'POST',
		endpoint: '/auth/signout',
	});
};

export const signUserUp = async ({
	body,
}: {
	body: CreateUserDto;
}): Promise<UserReturnDto> => {
	return await cinesyncFetch({
		method: 'POST',
		endpoint: '/auth/signup',
		body: JSON.stringify(body),
	});
};

export const signUserIn = async ({
	body,
}: {
	token: string;
	body: SigninUserDto;
}): Promise<TokenReturnDto> => {
	return await cinesyncFetch({
		method: 'POST',
		endpoint: '/auth/signin',
		body: JSON.stringify(body),
	});
};

export const uploadUserAvatar = async ({
	token,
	body,
}: {
	token: string;
	body: FormData;
}): Promise<EmptyReturnDto> => {
	return await cinesyncFetch({
		token,
		method: 'POST',
		endpoint: '/auth/avatar/upload',
		body: body,
	});
};

export const updateUser = async ({
	token,
	body,
}: {
	token: string;
	body: UpdateUserDto;
}): Promise<UserReturnDto> => {
	return await cinesyncFetch({
		token,
		method: 'PATCH',
		endpoint: '/auth/update',
		body: JSON.stringify(body),
	});
};

export const deleteUser = async ({
	token,
}: {
	token: string;
}): Promise<EmptyReturnDto> => {
	return await cinesyncFetch({
		token,
		method: 'DELETE',
		endpoint: '/auth/delete',
	});
};

export const deleteUserAvatar = async ({
	token,
}: {
	token: string;
}): Promise<EmptyReturnDto> => {
	return await cinesyncFetch({
		token,
		method: 'DELETE',
		endpoint: '/auth/avatar/delete',
	});
};

export const getUserFriends = async ({
	token,
}: {
	token: string;
}): Promise<UserFriendsDto> => {
	return await cinesyncFetch({
		token,
		method: 'GET',
		endpoint: '/auth/friends',
	});
};

export const sendFriendRequest = async ({
	token,
	body,
}: {
	token: string;
	body: sendUserFriendRequestDto;
}): Promise<EmptyReturnDto> => {
	return await cinesyncFetch({
		token,
		method: 'POST',
		endpoint: '/auth/friends/send',
		body: JSON.stringify(body),
	});
};

export const updateFriendRequest = async ({
	token,
	body,
}: {
	token: string;
	body: updateUserFriendsDto;
}): Promise<EmptyReturnDto> => {
	return await cinesyncFetch({
		token,
		method: 'POST',
		endpoint: '/auth/friends/update',
		body: JSON.stringify(body),
	});
};

export const getUserExport = async ({
	token,
}: {
	token: string;
}): Promise<UserDataExportDto> => {
	return await cinesyncFetch({
		token,
		method: 'GET',
		endpoint: '/export',
	});
};
