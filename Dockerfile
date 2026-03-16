FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV DATABASE_URL=postgresql://postgres:mysecret@postgres:5432/userdb

RUN npx prisma migrate
RUN npx prisma generate
RUN npm run build 

CMD ["npm", "run", "start"]