FROM node:18

# Create app directory
WORKDIR /app

# Bundle app source
COPY . .

# Setup restserver using json-server
RUN npm install json-server --save-dev
#RUN mkdir data
#COPY .docker/node/data/db.json data
CMD ["node_modules/.bin/json-server", "--port", "9190", "--no-cors", "data/db.json"]
