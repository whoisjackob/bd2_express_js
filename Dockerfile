FROM node:latest

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm install -g nodemon 

EXPOSE 5000

CMD [ "node", "server.js" ]