# ---- Builder: full dependency tree, compiles the server and the admin panel ----
FROM node:20-alpine AS builder
WORKDIR /opt/app

COPY package.json yarn.lock ./
# --production=false is explicit because the admin panel build needs the dev
# dependencies, and yarn 1 would otherwise drop them once NODE_ENV=production.
RUN yarn install --frozen-lockfile --production=false

COPY . .
# Set only for the build, so the admin bundle is built in production mode.
ENV NODE_ENV=production
RUN yarn build

# ---- Runtime: production dependencies plus the build output ----
FROM node:20-alpine
WORKDIR /opt/app

ENV NODE_ENV=production

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production && yarn cache clean

# `strapi start` resolves distDir from tsconfig.json's outDir, and does it by fully
# parsing the config -- TypeScript fails with TS18003 and exits if the include patterns
# match no file at all. So tsconfig.json needs its sources next to it even though the app
# itself runs from dist/. Do not drop these COPY lines to save space; the container will
# not start without them.
COPY tsconfig.json favicon.png ./
COPY src ./src
COPY config ./config
COPY types ./types
# Strapi looks for migrations under the app root, not under dist.
COPY database ./database
COPY public ./public
COPY --from=builder /opt/app/dist ./dist

EXPOSE 1337
CMD ["yarn", "start"]
