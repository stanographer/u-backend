FROM node:10-alpine

WORKDIR /usr/app

COPY package*.json ./

RUN npm install -qy

COPY . .

RUN npm run build


# You should always specify a full version here to ensure all of your developers
# are running the same version of Node.
FROM node:10-alpine

# Describe the working directory.
WORKDIR /usr/app

# Copy the package.json file.
COPY package*.json ./

# Install dependencies.
RUN npm install

# Copy all local files into the image.
COPY . .

# Build for production.
RUN npm run build

# Install `serve` to run the application.
RUN npm install -g serve

# Tell Docker about the port we'll run on.
EXPOSE 5000

# Set the command to start the node server.
CMD ["serve", "-s", "build"]
