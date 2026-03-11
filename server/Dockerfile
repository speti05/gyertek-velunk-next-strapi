FROM node:20-alpine
WORKDIR /opt/app

ENV NODE_ENV=production

COPY package.json yarn.lock ./
# Install all deps (Strapi's admin panel build requires dev dependencies)
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build

EXPOSE 1337
CMD ["yarn", "start"]
