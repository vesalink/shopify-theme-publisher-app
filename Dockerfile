FROM node:alpine

# set working directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

ENV PATH /usr/src/app/node_modules/.bin:$PATH

ADD ./react-ui ./react-ui
ADD ./server ./server

COPY package.json /usr/src/app/package.json
COPY webpack.config.prod.js /usr/src/app/webpack.config.prod.js
COPY ./server/views /usr/src/app/views

RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh

RUN cd react-ui && rm -rf .env && rm -rf .env.development && \
    npm install && \
    npm run build && \
    mv build ../ui_build && \
    cd ..  && \
    rm -rf .env && \
    npm install && \
    npm run build && \
    npm prune --production && \
    rm -rf server react-ui webpack.config.js ui_build/static/js/*.map ui_build/static/css/*.map

# production environment
CMD [ "npm", "start" ]

EXPOSE 3001