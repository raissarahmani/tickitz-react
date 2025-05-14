#Build stage
FROM node:22-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

#Rebuild 
FROM node:22-alpine
RUN npm install -g serve
WORKDIR /app/dist

COPY --from=builder /app/dist .

EXPOSE 80

CMD [ "serve", "-s", ".", "-l", "80" ]
