FROM node:12.14.0-alpine

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY package*.json ./

USER node

RUN npm install --production

COPY --chown=node:node . .

EXPOSE 8080

ENV NODE_ENV="production"

CMD ["node", "server.js"]