# This is a dockerfile to set up a nodejs environment for Vite development

# First select the base image
FROM node:22-alpine
# Set the working directory
WORKDIR /app
# Copy the package.json and package-lock.json files
COPY package.json package-lock.json ./
# Install the dependencies
RUN npm install
# Copy the rest of the application code
COPY . .
# Expose the port that the application will run on
EXPOSE 5173
# Start the application
CMD ["npm", "run", "dev"]