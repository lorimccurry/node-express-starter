FROM node:16-alpine
RUN npm install -g --unsafe-perm prisma

WORKDIR /home/node/app

COPY ./ ./prisma/

CMD [ "prisma", "studio"]