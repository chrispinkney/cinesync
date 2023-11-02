'use client';
import ListGrid from '@/components/List/ListGrid/ListGrid';
import { ListsContextProvider } from '@/context/lists.context';

const Dashboard = () => {
	return (
		<main>
			<ListsContextProvider>
				<ListGrid />
			</ListsContextProvider>
		</main>
	);
};

export default Dashboard;
