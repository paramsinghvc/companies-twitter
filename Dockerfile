FROM node:14.8.0-alpine3.10 as build-stage
WORKDIR /app

############# Copy all the required folders and files selectively to cache them into their individual layers #############
COPY ./package.json ./
COPY ./yarn.lock ./

RUN yarn install

COPY . .
RUN yarn build

FROM node:14.8.0-alpine3.10 as deploy
RUN yarn global add serve
WORKDIR /companies-twitter
COPY --from=build-stage /app/build ./build
COPY --from=build-stage /app/public ./public
COPY --from=build-stage /app/server/dist ./server/dist/
CMD ["node", "./server/dist/server.bundle.js"]
