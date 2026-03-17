FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV DATABASE_URL=postgresql://postgres:mysecret@postgres:5432/userdb

RUN npx prisma migrate
RUN npx prisma generate
RUN npm run build 

# Use this When Running the Container Individually
# CMD ["npm", "run", "start"]

# Use this When Using Docker Compose with Multiple Services
CMD sh -c "npx prisma migrate deploy && node dist/index.js"