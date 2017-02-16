FROM node:7.5-alpine

MAINTAINER quocnguyen <quocnguyen@clgt.vn>

WORKDIR /src

# extra tools to build native lib
RUN apk add --no-cache make gcc g++ python

# install and cache package.json
COPY package.json /src
RUN npm install --production
RUN apk del make gcc g++ python

# Bundle app source
COPY . /src

EXPOSE 6969

CMD ["npm","start"]
