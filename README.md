[Также доступно на русском языке](README_RU.md)

# Variscite API

**Part of "Variscite" project. Here is also [Dart library](https://github.com/uSlashVlad/variscite_dart) and [client app](https://github.com/uSlashVlad/variscite_mobile)**

API based on HTTP/HTTPS web protocol, layer between database and client apps. General functions of API at this moment:

- user authentication, groups
- adding and managment of geospatial data (points, lines, polygins)
- work with geolocation

This server app was developed using TypeScript, NodeJS and with Fastify as web-server. API documentation generation and request validations produced using OpenAPI specification (this specification is placed at *specs/api-v0.yml*). Highly recommended to work with this server app using docker-compose. MongoDB is used as main database.

# For users

**This instructions is common for both developers and admins**

It's necessary to set enviroment variables into *.env* file. Good example of such configuration is written in *.env.example* file.

If you don't have MongoDB yet, you can use this official installation and configuration guides:

- [Installation](https://docs.mongodb.com/manual/installation/)
- [Necessary configuration](https://docs.mongodb.com/manual/tutorial/enable-authentication/)

Also you can use [MongoDB Atlas](https://www.mongodb.com/atlas)

For using further instructions you should have Docker Compose. [Official installation guide](https://docs.docker.com/compose/install/)

## For developers

For running app in development mode it is enough to build container:
```sh
docker-compose build
```
and run it:
```sh
docker-compose up
```

When changing files, the program in the container will automatically restart thanks to [Nodemon](https://www.npmjs.com/package/nodemon).

## For administrators

If it is required to run app in production eviroment on server, you can build container using this command:
```sh
docker-compose -f docker-compose.yml -f docker-compose.prod.yml build
```
and run it:
```sh
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

In this case app will work in the background. You can check it' work using this command:
```sh
# I have to say that port can be different if you are using different value in .env file
curl http://localhost:80/status
```
You should recieve responce like this:
```json
{"text":"OK!"}
```
