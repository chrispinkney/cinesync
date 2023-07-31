'use client';
import { useState, useEffect } from 'react';

export default function Home() {
	const [hello, setHello] = useState<{ hello: string } | undefined>();

	useEffect(() => {
		(async () => {
			const res = await fetch('http://localhost:3000');
			const hello = await res.json();
			setHello(hello);
		})();
	}, []);

	return (
		<main>
			<h1>hello {hello?.hello}</h1>
		</main>
	);
}
