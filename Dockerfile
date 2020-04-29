FROM node:12-alpine
WORKDIR /usr/src/app

# Copy Package.json & install dependencies
COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

# Build Application
RUN npm run build

# Run Application
CMD [ "npm", "start"]
