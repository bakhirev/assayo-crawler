FROM node:18.16.0-alpine3.17
RUN apk --no-cache add git

RUN mkdir -p /usr/src/assayo_crawler/html
WORKDIR /usr/src/assayo_crawler

COPY node/ .
RUN npm install

ENV PORT 80

EXPOSE 80
CMD [ "node", "index.js"]
