'use client';
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
		</main>
	);
};

export default Home;
