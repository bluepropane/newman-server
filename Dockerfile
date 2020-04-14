FROM node:13

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm ci
RUN ln -s node_modules/.bin/newman /bin/newman
COPY bin bin

EXPOSE 8080
CMD ["npm", "start"]  