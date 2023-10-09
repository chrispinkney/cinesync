'use client';

import { useGlobalContext } from '@/Context/store';
import {
	Fragment,
	ReactNode,
	createContext,
	useContext,
	useEffect,
	useState,
} from 'react';

// Create context as undefined until fetch is completed
const ListsContext = createContext<
	{ lists: MovieList[]; refreshListsContext: () => Promise<void> } | undefined
>(undefined);

export const ListsContextProvider = ({ children }: { children: ReactNode }) => {
	const [lists, setLists] = useState<MovieList[] | null>(null);
	const { token } = useGlobalContext();

	// refreshListsContext will be provided so that child components can easily re-fetch data so page will be re-rendered
	const refreshListsContext = async () => {
		const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/lists`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `${token}`,
			},
		});
		const fetchedLists = (await response.json()).List;
		setLists(fetchedLists);
	};

	// Fetch once upon initial context load
	useEffect(() => {
		refreshListsContext();
	}, []);

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
