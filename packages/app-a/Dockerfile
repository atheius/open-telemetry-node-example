FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json .

RUN npm ci --omit=dev

COPY ./src .

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000
EXPOSE 9645

USER node

CMD ["node", "--require", "./instrumentation.js", "app.js"]
