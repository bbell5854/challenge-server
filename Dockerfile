FROM node:10.16.0-alpine

# Env
ENV ENVIRONMENT prd

# Create Directory for the Container
WORKDIR /usr/src/app

# Only copy the package.json file to work directory
COPY package.json .

# Install all Packages
RUN npm install -g typescript
RUN apk add --no-cache --virtual .gyp \
        python \
        make \
        g++ \
    && npm install \
    && apk del .gyp

# Copy all other source code to work directory
ADD . /usr/src/app

# TypeScript
RUN tsc

# Start
CMD [ "node", "." ]
EXPOSE 8080