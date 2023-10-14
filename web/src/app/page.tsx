'use client';
import Login from '@/components/Login/Login';
import { useState, useEffect } from 'react';

const Home = () => {
	const [hello, setHello] = useState<{ hello: string } | undefined>();

	useEffect(() => {
		(async () => {
			const res = await fetch(
				process.env.NEXT_PUBLIC_URL || 'http://localhost:3000',
			);
			const hello = await res.json();
			setHello(hello);
		})();
	}, []);

	return (
		<main>
			<h1>hello {hello?.hello}</h1>
			<Login />
		</main>
	);
};

export default Home;
