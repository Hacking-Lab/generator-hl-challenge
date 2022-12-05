FROM node:10.19.0

ADD package*.json ./

RUN npm i

ADD . ./

ENTRYPOINT [ "npm", "start" ]
