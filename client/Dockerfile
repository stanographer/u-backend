# ========= BUILD CLIENT =========

# Grab image.
FROM node:10-alpine

# Where our app will live in the container
WORKDIR /usr/app

# Copy the package.json.
COPY package*.json ./

# Install dependencies.
RUN npm install -qy

# Copy everything else into container.
COPY . .

# Expose the port.
EXPOSE 3000

# Start
CMD ["npm", "run", "startdev"]
