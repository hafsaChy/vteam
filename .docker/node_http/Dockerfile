FROM node:18

# Create app directory
WORKDIR /app

# Bundle app source
COPY . .

# Setup webserver 
RUN npm install http-server --save-dev
#RUN mkdir public
#COPY .docker/node/public/ public
CMD ["node_modules/.bin/http-server", "--port", "9180", "public"]
