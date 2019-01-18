# ========= BUILD CLIENT =========

# Grab image.
FROM node:10-alpine

# Where our app will live in the container
WORKDIR /usr/src/app

# Copy the package.json.
COPY package*.json ./

# Get rid of Error: could not get uid/gid.
RUN npm config set unsafe-perm true

# Install dependencies.
RUN npm install

# Copy everything else into container.
COPY . .

# Expose the port.
EXPOSE 3000

# Start
CMD ["npm", "run", "startdev"]
