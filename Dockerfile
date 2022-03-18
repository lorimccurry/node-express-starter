FROM node:16-alpine

# update packages
RUN apk update

USER node

WORKDIR /home/node/app

COPY --chown=node:node package*.json ./
COPY --chown=node:node tsconfig.json ./
COPY --chown=node:node src ./src

RUN npm install
RUN npm run build

COPY --chown=node:node . .

EXPOSE 3000

CMD ["node", "dist/server.js"]