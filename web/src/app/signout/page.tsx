'use client';
import { useEffect } from 'react';
import Loading from '../loading';
import { useRouter } from 'next/navigation';
import { useGlobalContext } from '../../Context/store';

const Signout = () => {
	const router = useRouter();
	const { setToken } = useGlobalContext();
	useEffect(() => {
		setToken('');
		localStorage.clear();
		router.replace('/');
	}, []);

	return <Loading />;
};

export default Signout;
