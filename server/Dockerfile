FROM node:12-alpine
#RUN apk add --no-cache nodejs npm
WORKDIR /app
COPY package*.json /app/
RUN npm install
EXPOSE 9999
COPY . /app
ENTRYPOINT [ "node" ]
CMD ["app.js"]
