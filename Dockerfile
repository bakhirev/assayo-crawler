FROM node:18.16.0-alpine3.17

RUN mkdir -p /usr/src/assayo_crawler
WORKDIR /usr/src/assayo_crawler

COPY src/ .
COPY package.json package-lock.json .
RUN npm install

EXPOSE 3000
CMD [ "npm", "start"]