# Dockerfile
#
# -------------------------------------
# Context: Build
FROM node:lts-alpine as build

# Set Working Directory Context
WORKDIR "/cinesync"

# Copy package files
COPY api/package.json .
COPY api/prisma prisma

# Context: Dependencies
FROM build AS dependencies

ARG DATABASE_URL

# Install Modules
RUN npm install
RUN npm install -g prisma
RUN npm run db:generate

# -------------------------------------
# Context: Builder
FROM dependencies as builder

# Copy necessary files to build cinesync
COPY api/src src
COPY api/tsconfig.json .
COPY api/tsconfig.build.json .
COPY api/nest-cli.json .

# tsc
RUN npm run build

# -------------------------------------
# Context: Release
FROM build AS release

# GET deployment code from previous containers
COPY --from=dependencies /cinesync/node_modules /cinesync/node_modules
COPY --from=builder /cinesync/dist /cinesync/dist

# Running cinesync when the image gets built
CMD ["sh", "-c", "npm run start:prod"]
