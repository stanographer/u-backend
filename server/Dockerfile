FROM node:10-alpine
WORKDIR /usr/app
COPY package*.json ./
RUN npm install -qy
COPY . .
EXPOSE 1988
CMD ["npm", "start"]
