# Use Node 18 (or a higher version)
FROM node:18-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if exists)
COPY package*.json ./

# Set npm timeout to 300 seconds (5 minutes) to avoid socket timeout issues
RUN npm config set fetch-timeout 300000

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose the port the app will run on
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start"]
