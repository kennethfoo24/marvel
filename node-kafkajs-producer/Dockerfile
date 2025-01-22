# Use an official Node.js runtime as a parent image
FROM node:18

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY node-kafkajs-producer/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY node-kafkajs-producer/. .

# Command to run the producer by default
CMD ["node", "producer.js"]
