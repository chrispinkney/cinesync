type TqueryParams = {
	key: PropertyKey;
	value: string;
};

type TcinesyncFetchParams = {
	successMessage?: string;
	method: string;
	endpoint: string;
	token?: string;
	queryParams?: TqueryParams[];
	body?: string | FormData;
};

const cinesyncFetch = async ({
	method,
	endpoint,
	token,
	queryParams,
	body,
}: TcinesyncFetchParams): Promise<{
	success: boolean;
	fetchResponseJson: any;
}> => {
	let url = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';
	let queryString = queryParams
		? '?' +
		  new URLSearchParams(
				Object.fromEntries(
					queryParams.map((param) => [param.key, param.value]),
				),
		  )
		: '';
	let fetchString = url + endpoint + queryString;
	let options: RequestInit = {
		method: method,
		headers: {
			accept: 'application/json',
			'Content-Type': 'application/json',
			Authorization: token ?? '',
		},
	};
	if (body) options.body = body;
	try {
		let res = await fetch(fetchString, options);
		try {
			// Possible image (blob) returned instead of json
			if (res.headers.get('content-type')?.includes('image/')) {
				return { success: true, fetchResponseJson: await getImageUrl(res) };
			}
			// Status ok -> return response data
			// Status not ok -> return error message from server
			// Status 204: No Content -> return empty data
			return {
				success: res.ok,
				fetchResponseJson: res.status == 204 ? {} : await res.json(),
			};
		} catch {
			throw new Error('Fetch did not return json or image');
		}
	} catch (error) {
		// Fetch error -> return empty data
		let errorMessage: string = 'Failed to fetch' + error;
		console.error(errorMessage); // Will be replaced by Snackbar in issue-95
		return {
			success: false,
			fetchResponseJson: { statusCode: 400, message: errorMessage },
		};
	}
};

const getImageUrl = async (res: Response): Promise<{ imageUrl: string }> => {
	let buffer = await res.arrayBuffer();
	let blob = new Blob([buffer], {
		type: `${res.headers.get('content-type')}`,
	});
	let url: string = URL.createObjectURL(blob);
	return { imageUrl: url };
};

export default cinesyncFetch;
