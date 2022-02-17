# tms_backend - Task Management System backend

Server side API project for TMS (Task Management System) frontend.  
It enables communication with a document-oriented database.

The project was written for a friendly company.  
It is used to manage services of security systems and other installations at various facilities.

## Table of contents

-   [Features](#features)
-   [Technologies](#technologies)
-   [Setup](#setup)
-   [Test](#test)
-   [Launch](#launch)
-   [Insipiration](#inspiration)

## Features

-   Basic authentication (register/login with hashed password)
-   Confirmation of account registration and password reset via e-mail
-   After successful login, token received in response
-   Other requests use received token in `Authorization` header
-   Pre-defined response structures with proper status codes
-   CRUD operations
-   CORS enabled
-   Field validation

## Technologies

-   TypeScript
-   Node.js
-   Express
-   MongoDB

## Setup

Clone this repository to your computer and run command `npm install` to install all the
dependencies.  
Create `.env` file in the root of the project. Copy variables from file `.sample_env` and give them
appropriate values.  
If you run application locally, set the following variables:

```
SERVER_PORT=3000
SERVER_HOST=http://localhost:3000
```

When I run server locally I have to specified port number for both variables, `SERVER_PORT` and
`SERVER_HOST`. When I run application on my production server I need only to specified port number
for `SERVER_PORT`. `SERVER_HOST` doesn't need it.

Application can connect to MongoDB Atlas cluster:  
`MONGO_URL=mongodb+srv://<user>:<password>@<cluster>/<database>`  
or MongoDB instance:  
`MONGO_URL=mongodb://<user>:<password>@<host>:<port>/<database>`  
Replace strings in angle brackets with your MongoDB deployment's details.

## Test

Run `npm run test` to start all the tests.

## Launch

Run `nodemon src/app.ts` to start the application.  
If you run application locally you will be able to access it at:  
`http://localhost:3000`

## Inspiration

This project was based on tutorials:

-   Island Coder876  
    _Full Stack Flutter Development_  
    https://www.youtube.com/playlist?list=PLFhJomvoCKC-HHwfZzIy2Mv59Uen88rqB
-   The Nerdy Canuck  
    _REST API Quickstarts_  
    https://www.youtube.com/playlist?list=PLdSnLYEzOTtoUdcTeSHuEn8B3VqIbbfuO
