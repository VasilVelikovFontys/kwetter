FROM node:16-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json and package-lock.json are copied
COPY ./package*.json ./

# For development
# RUN npm install

# For production:
RUN npm ci --only=production

# Bundle app source
COPY ./src ./

CMD [ "node", "index.js" ]
