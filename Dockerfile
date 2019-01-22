# ========= BUILD SERVER =========

# Grab image.
FROM node:10-alpine as server

RUN mkdir /usr/app

# Where our app will live in the container
WORKDIR /usr/app

# Copy the package.json.
COPY package*.json ./

# Get rid of Error: could not get uid/gid.
RUN npm config set unsafe-perm true

# Install dependencies.
RUN npm install -qy

# Install Nodemon.
RUN npm install nodemon -g

# Copy everything else into container.
COPY . .

# Expose the ports.
EXPOSE 1988 9090

# Start
CMD ["npm", "start"]



