# You should always specify a full version here to ensure all of your developers
# are running the same version of Node.
FROM node:10-alpine

# Describe the working directory.
WORKDIR /usr/app

# Copy the package.json file.
COPY package*.json ./

# Stop errors.
RUN npm config set unsafe-perm true

# Install dependencies.
RUN npm install -qy

# Copy all local files into the image.
COPY . .

# Build for production.
RUN npm run build --production

# Install `serve` to run the application.
RUN npm install -g serve

# Set to production env.
ENV REACT_APP_ENV production

# Tell Docker about the port we'll run on.
EXPOSE 5000

# Set the command to start the node server.
CMD ["serve", "-s", "build"]
