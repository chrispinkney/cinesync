'use client';

import { getLists } from '@/utils/cinesync-api/fetch-list';
import { useGlobalContext } from './store';
import {
	Fragment,
	ReactNode,
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from 'react';

// Create context as undefined until fetch is completed
const ListsContext = createContext<
	| { lists: MovieListLite[]; refreshListsContext: () => Promise<void> }
	| undefined
>(undefined);

export const ListsContextProvider = ({ children }: { children: ReactNode }) => {
	const [lists, setLists] = useState<MovieListLite[] | null>(null);
	const { token } = useGlobalContext();

	// refreshListsContext will be provided so that child components can easily re-fetch data so page will be re-rendered
	const refreshListsContext = useCallback(async () => {
		const { success, fetchResponseJson } = await getLists({ token: token });
		if (success && 'list' in fetchResponseJson)
			setLists(fetchResponseJson.list);
	}, [token]);

	// Fetch once upon initial context load
	useEffect(() => {
		refreshListsContext();
	}, [refreshListsContext]);

	// Automatically provide context to child components
	return (
		<Fragment>
			{lists != undefined && (
				<ListsContext.Provider value={{ lists, refreshListsContext }}>
					{children}
				</ListsContext.Provider>
			)}
		</Fragment>
	);
};

// Provide hook for child components to use lists context and ensure useContext is only used with the correct provider
export const useLists = () => {
	const context = useContext(ListsContext);
	if (context === undefined) {
		throw new Error(
			'useLists context must be used with a ListsContextProvider',
		);
	}
	return context;
};
