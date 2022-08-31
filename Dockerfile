# Build Stage
FROM node:16.15.1-alpine As development
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm install -g @nestjs/cli
RUN npm run build

FROM node:16.15.1-alpine as production
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
COPY --from=development /usr/src/app/dist ./dist
CMD ["node", "dist/main"]