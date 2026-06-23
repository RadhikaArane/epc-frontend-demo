FROM node:20

WORKDIR /app

COPY . .

RUN npm install

RUN npm run build

EXPOSE 4200

CMD ["npm", "start"]
