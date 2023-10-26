'use client';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Image from 'next/image';
import Link from 'next/link';

const About = () => {
	return (
		<Grid container direction="column" alignItems="center">
			<Grid item>
				<Typography variant="h4">CineSync</Typography>
				<p>
					CineSync is designed to bring the magic of cinema closer to movie
					enthusiasts. It is a modern and user-friendly web application that
					caters to the needs of movie enthusiasts and their friends. Our
					platform was created to bridge the gap between your love for movies
					and your desire to connect with friends and fellow cinephiles.
					CineSync allows you to synchronize and share your personalized movie
					watchlists effortlessly, transforming your movie-watching experience
					into a social, interactive, and community-driven adventure.
				</p>
				<p>
					The purpose of CineSync is simple yet profound: to create a vibrant
					and engaging community of movie enthusiasts who can share, discover,
					and celebrate the world of cinema together. We believe that movies
					have the power to bring people closer, spark conversations, and offer
					a unique form of entertainment. CineSync serves as the bridge that
					connects your passion for movies with the people who share that
					passion.
				</p>
				<p>
					Join us on this cinematic journey, and let CineSync enhance your love
					for movies, making every film-watching experience a shared adventure.
				</p>
				<Typography variant="h4">Features</Typography>
				<p>
					In essence, CineSync simplifies your cinematic journey in a few easy
					steps:
				</p>
				<ul>
					<li>
						<strong>Build and Share Your Watchlists:</strong> Start curating
						your movie watchlists. Whether it&apos;s your &quot;To Watch&quot;
						list, &quot;Watched&quot; list, or any other personalized category,
						you can create and manage them with ease. You have the flexibility
						to keep your lists private or share them with selected friends or
						groups.
					</li>
					<li>
						<strong>Discover Movies:</strong> Search and add movies from a vast
						database, complete with details such as titles, descriptions,
						genres, release years, and more. This feature makes it convenient to
						keep track of your favorite movies or plan your future watchlist.
					</li>
					<li>
						<strong>Stay Connected:</strong> The real-time synchronization
						feature ensures that you and your friends are always in the loop.
						You&apos;ll receive updates as friends add or remove movies from
						their watchlists, making it easy to coordinate movie nights.
					</li>
					<li>
						<strong>Connect with Friends:</strong> Search for friends and send
						or receive friend requests to build your cinematic community.
					</li>
					<li>
						<strong>Notifications:</strong> Receive notifications for various
						activities, including friend requests, list updates, and more, so
						you never miss a beat in the world of movies.
					</li>
					<li>
						<strong>Rate and Review:</strong> Share your thoughts on the movies
						you&apos;ve watched by providing ratings and reviews, contributing
						to the collective knowledge of the CineSync community.
					</li>
					<li>
						<strong>Responsive Design:</strong> Whether you&apos;re on a
						desktop, tablet, or mobile device, CineSync&apos;s responsive design
						guarantees a consistent and user-friendly experience.
					</li>
					<li>
						<strong>Secure and Reliable:</strong> The application places a
						strong emphasis on security, data persistence, error handling, and
						logging, ensuring your data is protected and your experience is
						smooth.
					</li>
				</ul>
				<Typography variant="h4" gutterBottom>
					Attribution
				</Typography>
				<Link href="https://www.themoviedb.org/">
					<Image
						src="/tmdb-primary-long.svg"
						alt="TMDB logo"
						height={12}
						width={165}
					/>
				</Link>
				<p>
					This product uses the TMDB API but is not endorsed or certified by
					TMDB.
				</p>
			</Grid>
			<Grid item pt={10}>
				<Typography variant="h6" align="center">
					&copy; {new Date().getFullYear()} Cinesync
				</Typography>
			</Grid>
		</Grid>
	);
};

export default About;
