# ========= BUILD SERVER =========

# Grab image.
FROM node:10-alpine as node

# Where our app will live in the container
WORKDIR /usr/src/app

# Copy the package.json.
COPY package*.json ./

# Install dependencies.
RUN npm install -qy

# Install Nodemon.
RUN npm install nodemon -g

# Copy everything else into container.
COPY . .

# Expose the port.
EXPOSE 9000

# Start
CMD ["npm", "start"]



