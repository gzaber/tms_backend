# tms_backend - Task Management System backend

An API server designed to manage tasks in an engineering company.  
It enables communication with a document-oriented database. It is used to manage maintenance of
security systems and other installations at various facilities.  
TMS web application is used to communicate with this server.

## Table of contents

-   [Features](#features)
-   [Technologies](#technologies)
-   [Setup](#setup)
-   [Launch](#launch)
-   [Test](#test)
-   [Insipiration](#inspiration)

## Features

-   Authentication
    -   sign up
    -   sign in
    -   reset forgotten password
-   Sign up confirmation, reset password confirmation sending by e-mail
-   Role based authorization
-   Email management
-   User management
-   Task (service) management
-   Field validation

## Technologies

-   TypeScript
-   Node.js
-   Express
-   MongoDB

## Setup

Clone or download this repository.  
Use the following command to install all the dependencies:

```
npm install
```

Create `.env` file in the project root directory with the following code:

```
# MongoDB Atlas cluster
MONGO_URL=mongodb+srv://user:password@cluster/database
#  or MongoDB instance
# MONGO_URL=mongodb://user:password@host:port/database

EMAIL_HOST=email.com
EMAIL_USER=username
EMAIL_PASSWORD=password
EMAIL_SENDER=username@email.com
EMAIL_VERIFICATION_EXPIRE_TIME=1h

SERVER_PORT=3000
SERVER_HOST=http://localhost:3000
SERVER_LOGIN_TOKEN_EXPIRETIME=1h
SERVER_CONFIRMATION_TOKEN_EXPIRETIME=1h
SERVER_TOKEN_ISSUER=tmsIssuer
SERVER_TOKEN_SECRET=tmsEncryptedSecret
```

Put your credentials in the `.env` file.

If server is running locally on port `3000`, set the following values:

```
SERVER_PORT=3000
SERVER_HOST=http://localhost:3000
```

If application is running on production server it may not need port number for `SERVER_HOST`:

```
SERVER_PORT=3333
SERVER_HOST=http://server.com
```

Application can connect to MongoDB Atlas cluster or MongoDB instance:

```
MONGO_URL=mongodb+srv://<user>:<password>@<cluster>/<database>
MONGO_URL=mongodb://<user>:<password>@<host>:<port>/<database>
```

Replace strings in angle brackets with your MongoDB deployment's details.

## Launch

Run the application using the following command:

```
nodemon src/app.ts
```

## Test

Run the tests using IDE or using the following command:

```
npm run test
```

## Inspiration

This project was based on tutorials:

-   Island Coder876  
    _Full Stack Flutter Development_  
    https://www.youtube.com/playlist?list=PLFhJomvoCKC-HHwfZzIy2Mv59Uen88rqB
-   The Nerdy Canuck  
    _REST API Quickstarts_  
    https://www.youtube.com/playlist?list=PLdSnLYEzOTtoUdcTeSHuEn8B3VqIbbfuO
