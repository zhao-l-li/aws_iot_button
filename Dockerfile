FROM node:4.4

RUN mkdir -p /usr/src/app/
WORKDIR /usr/src/app/

COPY package.json /usr/src/app/.
RUN npm install -g \
  lambda-local

COPY . /usr/src/app/

