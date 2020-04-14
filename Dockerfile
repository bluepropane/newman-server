FROM node:13

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm ci
COPY bin bin

CMD ["npm", "start"]