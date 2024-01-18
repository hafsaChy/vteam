# Vteam project
This project is a part of the course 'vteam' at Blekinge Tekniska Högskolan. The project aims to provide an efficient and eco-friendly solution for urban commuting using electric scooters. This repository contains the codebase for the entire project, including the server, client, web app, and bike control system.

## Table of Contents

- [Project Overview](#project-overview)
- [Components](#components)
- [Getting Started](#getting-started)
- [Running the Project](#running-the-project)

## Project Overview

Elcyckel consists of the following components:

- **Server:** Handles backend logic, interacts with the database, and provides APIs.
- **Client:** The front-end application used by users to interact with the system.
- **Web App:** A web-based dashboard for monitoring and managing the scooter fleet.
- **Bike Control System:** Manages individual scooters, including simulation features for testing.

## Components

- **Server:**
  - [Documentation](server/README.md)
  - Technologies: Node.js, Express, MySQL

- **Client:**
  - [Documentation](client/README.md)
  - Technologies: React, JavaScript

- **Web App:**
  - [Documentation](webapp/README.md)
  - Technologies: React, JavaScript

- **Bike Control System:**
  - [Documentation](bike/README.md)
  - Technologies: Python

## Getting Started

Follow these instructions to set up and run the entire Elcyckel project locally.

### Prerequisites

Ensure you have the following tools installed:

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

## Running the Project

1. Clone this repository to your local machine:

```git clone https://github.com/hafsaChy/vteam.git <!-- cd server -->```

2. Build and start the Docker containers:
```bash setup.bash up```
or 
```./setup.bash up```

It builds the neccessary containers and then network starts up. First, mariadb starts and then server starts. The express server has the url ```http://localhost:3050/```. The client url is ```http://localhost:3000/``` and webapp can be seen in ```http://localhost:3003/```.

## To shut down the docker containers and network
```
./setup.bash down
```