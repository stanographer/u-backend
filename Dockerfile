FROM node:14-alpine
WORKDIR /app
COPY package*.json /app/
RUN npm install
EXPOSE 9999
COPY . /app
ENTRYPOINT [ "node" ]
CMD ["app.js"]
