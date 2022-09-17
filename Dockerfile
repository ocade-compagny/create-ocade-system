FROM node:lts-alpine

RUN mkdir -p /app/application

WORKDIR /app/application 

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

COPY package.json /app/application

COPY . /app/application

RUN npm install

CMD ["npm", "start"]