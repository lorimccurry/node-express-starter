<div id="top"></div>

[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![LinkedIn][linkedin-shield]][linkedin-url]

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/lorimccurry/node-starter">
    <h1>Node - Express - Docker - Typescript Starter</h1>
  </a>

  <p align="center">
    A starter Express app with all the goodies to get you up and running quickly!
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details open>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#prisma-docker-tips">Prisma-Docker Tips</a></li>
    <li><a href="#make-commands">Make Commands</a></li>
    <li><a href="#starter-endpoints">Starter Endpoints</a></li>
    <li><a href="#database-gui-connections">Database GUI Connections</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->
<br>

## About The Project

### Built With

- [Node.js](https://nodejs.org)
- [Express.js](https://expressjs.com/)
- [Postgres](https://www.postgresql.org/)
- [Typescript](https://www.typescriptlang.org/)
- [Prisma](https://www.prisma.io/)
- [Docker](https://www.docker.com/)
- [Jest](https://jestjs.io/)
- [Supertest](https://github.com/visionmedia/supertest)
- [Nodemon](https://nodemon.io/)
- [Morgan](https://github.com/expressjs/morgan)
- [Winston](https://github.com/winstonjs/winston)
- [Husky](https://github.com/expressjs/morgan)

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

To get a local copy up and running follow these simple example steps.

### Prerequisites

1. npm

```sh
npm install npm@latest -g
```

2. Postgres (a couple suggestions to get started)

- [Homebrew for mac](https://wiki.postgresql.org/wiki/Homebrew)
- [Postgres downloads](https://www.postgresql.org/download/)

3. Postgres requirements:

- Start your server
- Confirm the default user is present or create a new one with the ability to `Create DB`

4. Create a `.env.` and `.env.test` using `.env.example` and `.env.test.example` and populate with your information

- TIP: notice the various database connection urls in `.env.example` especially. Connecting with Prisma inside a Docker container can be a little tricky.

5. [Install Docker desktop](https://docs.docker.com/desktop/)

6. Other handy tools:

- [Postman](https://www.postman.com/) or similar API Management tool
- A database GUI tool compatible with Postgres (such as [TablePlus](https://tableplus.com/))

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/lorimccurry/node-starter.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Building Docker containers for local dev/test
   ```sh
   make build
   ```
   ```sh
   make up-with-test
   ```
4. Containers that should be running:

- `node_backend` on http://localhost:8000
- `node_backend_test` on http://localhost:4000
- `development-db`
- `test_db`

5. Starting Prisma Dev Client

- enter `node_backend` container
  ```sh
   docker exec -it node_backend /bin/sh
  ```
- from inside the container start the prisma client and make the database current (should contain a User table when complete)
  ```sh
   npm run init-prisma-dev
  ```

6. Starting Prisma Test Client

- enter `node_backend_test` container

  ```sh
   docker exec -it node_backend_test /bin/sh
  ```

- from inside the container:
  - start the prisma client and make the database current (should contain a User table when complete)
  ```sh
   npm run init-prisma-test
  ```
  - run existing test suite with either command:
  ```sh
   npm test
  ```
  ```sh
  jest
  ```

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- PRISMA/DOCKER TIPS -->

## Prisma-Docker Tips

Most of the Prisma documentation and examples are geared for local development, and not Docker development. A few tips:

- The Prisma connection string (in your various `.env` files) is key to getting Prisma to know about your database. For it to work in Docker, the host is the name of the postgres db container you want to connect with.
- You will run Prisma migrations and other Prisma commands from INSIDE the given node backend container. Prisma commands will not work outside of containers and will complain it can't find your database. Node container access command:

```sh
docker exec -it container_name /bin/sh
```

- You also will run test commands from inside the `node_backend_test` container, or similar to the above point, Prisma will not know about your test db.
- The project is geared for Docker development, but you can run it locally. Uncomment the Prisma connection url in `.env` to either of the local options. The scripts in `package.json` should work locally. (ie: `npm run dev`, etc). You will need to create local databases if you develop outside of the docker containers.
- If things ever get weird with your database, you can nuke the docker volume (and all your data!) with the following bash script. It is included in the `make build` command as well.

```sh
bash clean_pgdata.sh
```

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- Make Commands -->

## Make Commands

This project has a Makefile to make (ha) for easier commands. Please take a look as not all commands have been noted in this README.

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- STARTER ENDPOINTS -->

## Starter Endpoints

Starter endpoints for "gut check" and auth have already been created for you. The auth endpoints are tested.

Postman collection:

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/14970266-255b09c7-4f87-4738-9e1c-41f80ed18218?action=collection%2Ffork&collection-url=entityId%3D14970266-255b09c7-4f87-4738-9e1c-41f80ed18218%26entityType%3Dcollection%26workspaceId%3Da24cdcef-b3c5-4ff6-8b77-fc212dd7ea44)

1. Gut check:

- Development: http://localhost:8000
- Test: http://localhost:4000
- All endpoints should work for either port

2. Auth

- http://localhost:8000/v1/auth/signup

  - a `201` will add an auth token to the headers

- request body:

```json
{
  "email": "e@email.com",
  "password": "password"
}
```

- `201` response body

```json
{
  "id": 1,
  "createdAt": "2022-04-09T19:57:11.119Z",
  "updatedAt": "2022-04-09T19:57:11.119Z",
  "email": "e@email.com",
  "name": null
}
```

- http://localhost:8000/v1/auth/signin
  - request and response body is the same as `/signup`

3. Logger

- http://localhost:8000/v1/logger
- Endpoint for show/test purposes only. Delete as desired (don't ship to prod!).
- Shows logging with Winston
- Has middleware auth protection on the route to demonstrate/test `verifyToken` in `/utils/auth.ts`
- `401` if you are not logged in
- `201` and logging info if you are logged in

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- DATABASE GU1 -->

## Database GUI connections

Database connections with Prisma can be a little tricky as you have to connect to the database via the Docker container.

1. Dev db connection info:

- Host/Socket: `0.0.0.0`
- Port: `5433`
- user: `Your user from your .env file`
- password: `Your password from your .env file`
- database: `prisma`

2. Test db connection info

- Host/Socket: `0.0.0.0`
- Port: `5434`
- user: `Your user from your .env.test file`
- password: `Your password from your .env.test file`
- database: `test`

3. If you connect without using Docker (make sure to adjust the connection url in your `.env` file):

- Host/Socket: `127.0.0.1`
- Port: `5432`
- user: `Your user from your .env file`
- password: `Your password from your .env file`
- database: `prisma`

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- ROADMAP -->

## Roadmap

- Google Auth support
- `/signout` endpoint
- Support for prod/deployment
- CI/CD support

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- CONTRIBUTING -->

## Contributing

Thank you for your interest in this project - it is greatly appreciated. It isn't quite ready for contributions yet as it's still under heavy development. Please give it a star if you like!

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- CONTACT -->

## Contact

Lori McCurry - lori.mccurry@gmail.com

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[contributors-shield]: https://img.shields.io/github/contributors/github_username/repo_name.svg?style=for-the-badge
[contributors-url]: https://github.com/lorimccurry/node-starter/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/lorimccurry/node-starter.svg?style=for-the-badge
[forks-url]: https://github.com/lorimccurry/node-starter/network/members
[stars-shield]: https://img.shields.io/github/stars/lorimcurry/node-starter.svg?style=for-the-badge
[stars-url]: https://github.com/lorimccurry/node-starter/stargazers
[issues-shield]: https://img.shields.io/github/issues/github_username/repo_name.svg?style=for-the-badge
[issues-url]: https://github.com/lorimccurry/node-starter/issues
[license-shield]: https://img.shields.io/github/license/github_username/repo_name.svg?style=for-the-badge
[license-url]: https://github.com/github_username/repo_name/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://www.linkedin.com/in/lorimccurry/
[product-screenshot]: images/screenshot.png
