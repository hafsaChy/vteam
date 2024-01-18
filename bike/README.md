# bike README

This repository contains the Scooter Control System component of the project. The Elcyckel Bike Control System is responsible for managing individual scooters, including their status, battery levels, and simulated ride features.

## Getting Started

Follow these instructions to set up and run.

### Prerequisites

Make sure you have the following tools installed on your machine:

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

### Running the code

1. Clone this repository to your local machine:

   ```git clone https://github.com/hafsaChy/vteam.git```

2. Build and start the Docker containers:
```bash setup.bash up```
or 
```./setup.bash up```

3. Running the code:
```python3 cykel.py scooter_id user_id```
scooter_id and user_id can be get from webapp from ```http://localhost:3003/```.

4. To view the logs of the bike service, run the following command:
```docker-compose logs bike```