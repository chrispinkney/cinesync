'use client';

import {
	Fragment,
	ReactNode,
	createContext,
	useContext,
	useEffect,
	useState,
} from 'react';

// Create context as undefined until fetch is completed
const MovieListContext = createContext<
	| {
			movieList: MovieList;
			refreshMovieListContext: () => Promise<void>;
	  }
	| undefined
>(undefined);

export const MovieListContextProvider = ({
	children,
	listId,
}: {
	children: ReactNode;
	listId: number;
}) => {
	const [movieList, setMovieList] = useState<MovieList | null>(null);

	// refreshMovieListContext will be provided so that child components can easily re-fetch data so page will be re-rendered
	const refreshMovieListContext = async () => {
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_URL}/lists/${listId}`,
			{
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
				credentials: 'include',
			},
		);
		const fetchedMovieList = (await response.json()).List[0];
		setMovieList(fetchedMovieList);
	};

	// Fetch once upon initial context load
	useEffect(() => {
		refreshMovieListContext();
	}, []);

	// Automatically provide context to child components
	return (
		<Fragment>
			{movieList != undefined && (
				<MovieListContext.Provider
					value={{ movieList, refreshMovieListContext }}
				>
					{children}
				</MovieListContext.Provider>
			)}
		</Fragment>
	);
};

// Provide hook for child components to use lists context and ensure useContext is only used with the correct provider
export const useMovieList = () => {
	const context = useContext(MovieListContext);
	if (context === undefined) {
		throw new Error(
			'useList context must be used with a MovieListContextProvider',
		);
	}
	return context;
};
