FROM node

RUN npm install pm2 -g 

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["pm2-runtime", "start", "ecosystem.config.js"]