# Setup and build the client

FROM node:10-alpine as client
WORKDIR /usr/app/client/
COPY client/package*.json ./
RUN npm install
COPY client/ ./
RUN npm run build

# Setup the server
FROM node:10-alpine
WORKDIR /usr/app/
COPY --from=client /usr/app/client/build/ ./client/build/

WORKDIR /usr/app/server/
COPY server/package*.json ./
RUN npm install
COPY server/ ./

ENV NODE_ENV production

EXPOSE 9090 1988 5000

CMD ["npm", "start"]
