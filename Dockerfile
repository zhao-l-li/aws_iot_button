FROM node:4.4

RUN mkdir -p /usr/src/app/
WORKDIR /usr/src/app/

RUN npm install -g \
  lambda-local

COPY package.json /usr/src/app/.
RUN npm install

COPY . /usr/src/app/

