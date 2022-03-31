# dev image
FROM node:16-alpine as base

USER node

WORKDIR /home/node/app

COPY --chown=node:node package*.json ./
COPY --chown=node:node prisma ./prisma/

RUN npm install

COPY --chown=node:node . .

RUN npx prisma generate

# production image
FROM base as production

ENV NODE_PATH=./dist

RUN npm run build