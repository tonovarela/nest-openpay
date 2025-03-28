# Nest Open Pay API

## Description

This is a REST API built with NestJS for managing credit cards using the Open Pay platform. It allows you to register, list, and generate text files with card information.

## Technologies Used

-   [NestJS](https://nestjs.com/): A framework for building efficient and scalable server-side applications.
-   [Prisma](https://www.prisma.io/): An ORM for interacting with the database.
-   [MySQL](https://www.mysql.com/): The database used to store information.
-   [Docker](https://www.docker.com/): A platform for containerizing the application.
-   [JWT](https://jwt.io/): JSON Web Tokens for authentication and authorization.
-   [Class Validator](https://github.com/typestack/class-validator): A library for data validation.
-   [Axios](https://axios-http.com/): An HTTP client for making requests to Open Pay.
-   [Basic-ftp](https://www.npmjs.com/package/basic-ftp): An FTP client for uploading files.

## Requirements

-   [Node.js](https://nodejs.org/en/download/) (v16 or higher)
-   [Docker](https://docs.docker.com/get-docker/)
-   [Docker Compose](https://docs.docker.com/compose/install/)

## Installation

1.  Clone the repository:

    ```bash
    git clone 
    cd nest-open-pay
    ```

2.  Configure environment variables:

    Create a `.env` file in the root of the project and define the following variables:

    ```properties
    DATABASE_URL="mysql://user_openpay:123456789*@localhost:3306/openpay?connection_limit=5"
    JWT_SECRET=your_secret_key
    MERCHANT_ID=your_merchant_id
    PUBLIC_KEY=your_public_key
    URL_OPENPAY=https://sandbox-api.openpay.mx/v1
    FTP_HOST=your.ftp.server
    FTP_USER=ftp_username
    FTP_PASSWORD=ftp_password
    FTP_PORT=21
    ```

3.  Start the containers with Docker Compose:

    ```bash
    docker-compose up --build -d
    ```

4.  Install Node.js dependencies:

    ```bash
    npm install
    ```

5.  Run Prisma migrations:

    ```bash
    npx prisma migrate dev --name init
    ```

6.  Generate the Prisma client:

    ```bash
    npx prisma generate
    ```

## API Endpoints

### Register Card

-   **Endpoint:** `POST /card`
-   **Body:**

    ```json
    {
      "first_name": "John",
      "last_name": "Doe",
      "last_name2": "Smith",
      "card_number": "4242424242424242",
      "expiration_month": "12",
      "expiration_year": "25",
      "cvv2": 123
    }
    ```

### List Cards

-   **Endpoint:** `GET /card`
-   **Response:**

    ```json
    {
      "cards": [
        {
          "id": 1,
          "number": "***********424",
          "token": "tok_id"
        }
      ]
    }
    ```

### Download Text File

-   **Endpoint:** `GET /card/download`
-   **Response:** Downloads a text file with card information.

### Upload File via FTP

-   **Endpoint:** `POST /card/upload`
-   **Form-data:** `file=@/path/to/local/file.txt`

## Authentication

The API is protected with JWT. To access the endpoints, you need to send the token in the `Authorization` header with the format `Bearer <token>`.

## Seed

To populate the database with test data, run:

```bash
npm run seed