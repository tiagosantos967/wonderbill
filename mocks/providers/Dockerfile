# syntax=docker/dockerfile:1
FROM node:14-alpine

COPY . /app

WORKDIR /app

RUN npm install

CMD ["npm", "start"]