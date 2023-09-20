import styles from './loading.module.css';
import { Shadows_Into_Light } from 'next/font/google';

const shadowsIntoLight = Shadows_Into_Light({
	subsets: ['latin'],
	weight: '400',
});

const Loading = () => {
	return (
		<div className={styles.center}>
			<div className={styles.animationContainer}>
				<div className={styles.reel}>
					<div className={styles.circle}></div>
					<div className={styles.circle}></div>
					<div className={styles.circle}></div>
					<div className={styles.circle}></div>
					<div className={styles.circle}></div>
					<div className={styles.circle}></div>
					<div className={styles.axle}></div>
				</div>
				<div className={styles.film}>
					<svg>
						<path
							d="M 8 0 Q 12 10 8 20 Q 4 30 8 40 Q 12 50 8 60 Q 4 70 8 80 Q 12 90 8 100 Q 4 110 8 120 Q 12 130 8 140 Q 4 150 8 160"
							stroke="white"
							strokeWidth="3"
						/>
					</svg>
				</div>
			</div>
			<h1 className={shadowsIntoLight.className} style={{ color: 'white' }}>
				Loading...
			</h1>
		</div>
	);
};

export default Loading;
