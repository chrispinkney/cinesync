'use client';

import {
	Dispatch,
	Fragment,
	ReactNode,
	SetStateAction,
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from 'react';
import { useGlobalContext } from './store';
import { getListById } from '@/utils/cinesync-api/fetch-list';

// Create context as undefined until fetch is completed
const MovieListContext = createContext<
	| {
			movieList: MovieList;
			setMovieList: Dispatch<SetStateAction<MovieList | null>>;
			refreshMovieListContext: () => Promise<void>;
			listEdited: boolean;
			setListEdited: (arg0: boolean) => void;
	  }
	| undefined
>(undefined);

export const MovieListContextProvider = ({
	children,
	listId,
}: {
	children: ReactNode;
	listId: string;
}) => {
	const { token } = useGlobalContext();
	const [movieList, setMovieList] = useState<MovieList | null>(null);
	// Track if movie has been added or list title changed to allow list saving
	const [listEdited, setListEdited] = useState<boolean>(false);

	// refreshMovieListContext will be provided so that child components can easily re-fetch data so page will be re-rendered
	const refreshMovieListContext = useCallback(async () => {
		const { success, fetchResponseJson } = await getListById({
			token: token,
			listId: listId,
		});
		if (success && 'list' in fetchResponseJson) {
			setMovieList(fetchResponseJson.list);
		}
	}, [listId, token]);

	// Fetch once upon initial context load
	useEffect(() => {
		refreshMovieListContext();
	}, [refreshMovieListContext]);

	// Automatically provide context to child components
	return (
		<Fragment>
			{movieList != undefined && (
				<MovieListContext.Provider
					value={{
						movieList,
						setMovieList,
						refreshMovieListContext,
						listEdited,
						setListEdited,
					}}
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
