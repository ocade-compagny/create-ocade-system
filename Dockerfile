FROM node:14-alpine

RUN mkdir -p /app/application
WORKDIR /app/application 

COPY package.json /app/application

COPY . /app/application

RUN npm ci

CMD ["npm", "start"]