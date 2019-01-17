# Setup and build the client

FROM node:10-alpine as upwordly-client
WORKDIR /usr/app/client/
COPY client/package*.json ./
RUN npm install -qy
COPY client/ ./
RUN npm run build --production

# Setup the server
FROM node:10-alpine as server
WORKDIR /usr/app/
COPY --from=upwordly-client /usr/app/client/build/ ./client/build/

WORKDIR /usr/app/
COPY ./package*.json ./
RUN npm config set unsafe-perm true
RUN npm install -qy
RUN npm install nodemon -g
COPY . .

ENV NODE_ENV production

EXPOSE 9000

CMD ["npm", "start"]
