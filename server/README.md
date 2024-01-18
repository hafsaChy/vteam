# Server README

This repository contains the server component of the Electric scooter project. The server is responsible for handling requests, interacting with the database, and serving the necessary APIs for the Elcyckel application.

## Getting Started

Follow these instructions to set up and run the server locally.

### Prerequisites

Make sure you have the following tools installed on your machine:

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

### Running the Server Locally

1. Clone this repository to your local machine:

   ```git clone https://github.com/hafsaChy/vteam.git```

2. Build and start the Docker containers:
```bash setup.bash up```
or 
```./setup.bash up```

The server should now be running on port 3050. You can access it in your web browser or make API requests.

To view the logs of the server service, run the following command:
```docker-compose logs server```

