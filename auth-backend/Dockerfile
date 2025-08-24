FROM node:22-alpine

WORKDIR /user/src/app/backend

COPY package*.json .

RUN npm install

COPY . .

RUN npm run build

EXPOSE 5001

CMD [ "npm","start" ]