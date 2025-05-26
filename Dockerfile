FROM node:18

WORKDIR /app

COPY . .

RUN yarn install && yarn build

CMD ["node", "dist/src/main.js"]
