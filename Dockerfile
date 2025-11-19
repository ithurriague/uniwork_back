FROM node:24
LABEL authors="fithurriague"

WORKDIR /app

COPY package*.json ./
RUN npm install

EXPOSE 8000

CMD ["sh", "-c", "npm run dev"]