FROM node:10.16.0-alpine

WORKDIR /usr/src/app

COPY package.json .

RUN npm install -g typescript
RUN apk add --no-cache --virtual .gyp \
        python \
        make \
        g++ \
    && npm install \
    && apk del .gyp

ADD . /usr/src/app

RUN tsc

CMD [ "node", "." ]
EXPOSE 80