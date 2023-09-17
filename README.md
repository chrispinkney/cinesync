<h1 align="center">
	<img width="430" height="130" src="web\public\logo.png">
</h1>

![Node.js CI](https://github.com/chrispinkney/cinesync/actions/workflows/docker.yml/badge.svg)
![Node.js CI](https://github.com/chrispinkney/cinesync/actions/workflows/format_lint.yml/badge.svg)
![Vercel](https://vercelbadge.vercel.app/api/chrispinkney/cinesync)

## What is CineSync?

CineSync is a web application that allows movie enthusiasts to synchronize and share their personalized watchlists with friends or groups. This platform empowers users to curate and manage their movie preferences, exchange recommendations, and enjoy the magic of cinema as a cohesive community.

The target audience for CineSync would primarily consist of movie enthusiasts and individuals who enjoy watching films. The platform aims to cater to a diverse range of users with varying levels of interest in movies, from casual viewers to avid cinephiles.

## How can I run the app?

### Initial Setup

CineSync is currently running on Node v18.

- `git clone https://github.com/chrispinkney/cinesync.git`
- `cd cinesync/api`
- `npm i`
- `npm run db:generate`
- `cd ../web`
- `npm i`

### Running Cinesync

- `cd cinesync/api`
- `npm run dev`
- `cd ../web`
- `npm run dev`

## How was CineSync built?

CineSync was built using several wonderful pieces of technology:

- The frontend is developed using the [NextJS](https://github.com/vercel/next.js/) framework.

- The backend is developed using the [NestJS](https://github.com/nestjs/nest) framework.

- The PostgreSQL database operates via the [Prisma](https://github.com/prisma/prisma#readme) framework ORM, simplifying the interaction between the application and the database.

- CineSync also employs several other important miscellaneous pieces of tech such as: [TypeScript](https://github.com/microsoft/TypeScript), [Prettier](https://github.com/prettier/prettier#readme), [ESlint](https://www.npmjs.com/package/eslint), and [Husky](https://github.com/typicode/husky#readme).
