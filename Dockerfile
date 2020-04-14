FROM node:13

WORKDIR /
COPY bin .
RUN npm install

CMD ['npm', 'start']