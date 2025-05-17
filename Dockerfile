# This is a dockerfile to set up a nodejs environment for Vite development

# First select the base image
FROM node:22-alpine

# Install Git and set up the terminal prompt
RUN apk update && apk add --no-cache git \
    && echo 'export PS1="\[\033[1;32m\]\u@rank-up\[\033[0m\]:\[\033[1;34m\]\w\[\033[0m\]\$ "' >> /etc/profile

# Set the working directory
WORKDIR /app
# Copy the package.json and package-lock.json files
COPY package*.json ./
# Install the dependencies
RUN npm install --force && npm cache clean --force
# Copy the rest of the application code
COPY . .
# Expose the port that the application will run on
EXPOSE 5173
# Start the application
CMD ["npm", "run", "dev"]