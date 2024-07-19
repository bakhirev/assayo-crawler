FROM node:18.16.0-alpine3.17

RUN mkdir -p /usr/src/assayo_crawler/html
WORKDIR /usr/src/assayo_crawler

COPY node/ .
COPY build/ ./html
RUN npm install

ENV PORT 3000

EXPOSE 3000
CMD [ "npm", "start"]
