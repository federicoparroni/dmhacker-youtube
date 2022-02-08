# FROM node:12.22.1-alpine3.10
FROM node:12.22.1-alpine3.10

WORKDIR /app
COPY package.json ./
# COPY package-lock.json ./

RUN npm install
COPY . .

EXPOSE 5000 9229
CMD ["npm", "run", "start"]
