'use client';

import {
	createContext,
	useContext,
	Dispatch,
	SetStateAction,
	useState,
	useEffect,
	ReactNode,
} from 'react';

type DataType = {
	token: string;
};

interface ContextProps {
	token: string;
	setToken: Dispatch<SetStateAction<string>>;
	data: DataType[];
	setData: Dispatch<SetStateAction<DataType[]>>;
}

const GlobalContext = createContext<ContextProps>({
	token: '',
	setToken: (): string => '',
	data: [],
	setData: (): DataType[] => [],
});

export const GlobalContextProvider = ({
	children,
}: {
	children: ReactNode;
}) => {
	const [token, setToken] = useState('');
	const [data, setData] = useState<[] | DataType[]>([]);

	useEffect(() => {
		let acc_token = localStorage.getItem('token');
		if (acc_token) {
			setToken(acc_token);
		}
	}, []);

	return (
		<GlobalContext.Provider value={{ token, setToken, data, setData }}>
			{children}
		</GlobalContext.Provider>
	);
};

export const useGlobalContext = () => useContext(GlobalContext);
