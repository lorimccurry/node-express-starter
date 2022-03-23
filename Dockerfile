FROM node:16-alpine as base

# update packages
RUN apk update

USER node

WORKDIR /home/node/app

COPY --chown=node:node package*.json ./
COPY --chown=node:node tsconfig.json ./

RUN npm install

COPY --chown=node:node . .

FROM base as production

ENV NODE_PATH=./dist

RUN npm run build