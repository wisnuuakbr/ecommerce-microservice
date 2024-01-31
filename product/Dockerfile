# Parent image 
FROM node:14

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.sjon to container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the apps to container
COPY . .

# command
CMD [ "npm", "start" ]