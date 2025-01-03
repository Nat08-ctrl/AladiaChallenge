# NestJS Microservices Demo

This project demonstrates a NestJS backend implementation with microservices architecture, MongoDB integration, and caching.

## Features

- RESTful API endpoints following best practices
- Request validation using class-validator
- Error handling with custom filters
- Microservices architecture
- MongoDB integration
- Redis caching
- Swagger API documentation

## Project Structure

```
src/
├── common/
│   ├── filters/
│   │   └── http-exception.filter.ts
│   └── interceptors/
│       └── transform.interceptor.ts
├── products/
│   ├── dto/
│   │   ├── create-product.dto.ts
│   │   └── update-product.dto.ts
│   ├── schemas/
│   │   └── product.schema.ts
|   ├── tests/
│   │   |── products.microservice.spec.ts
│   │   └── products.service.spec.ts
│   ├── products.controller.ts
│   ├── products.module.ts
│   └── products.service.ts
├── app.module.ts
|── main.ts
└── microservice-client.ts
```

## Prerequisites

- Node.js
- MongoDB
- Redis

## Installation

```bash
cd <to_project_folder>
```

```bash
npm install
```

## Running the app

Ensure MongoDB and Redis are running

```bash
# development
npm run start

# watch mode
npm run start:dev

# production mode
npm run start:prod
```

## Checking microservice is working

```bash
# App starts on port 3000 (HTTP) and 3001 (TCP)
# Run this the test client connects and receives data
node src/microservice-client.ts

# In the terminal it logs "Connected to microservice" and you can see product data
```

## Test if caching is working

```bash
# start the redis <for ubuntu>
sudo systemctl start redis

# check the status
sudo systemctl status redis
```

```bash
#Get all products (this will cache the result):
curl http://localhost:3000/api/products

# Check Redis for the cached data
redis-cli
> KEYS *

# We now see all_products in the keys list. If we make the same GET request again within 30 seconds, it should return the cached data and we'll see the debug log message only on cache misses.
```

## API Documentation

Once the application is running, you can access the Swagger API documentation at:

```
http://localhost:3000/api
```

## Architecture Decisions

1. **Microservices**: The application is structured using a microservices architecture, with separate modules for different business domains (Products).

2. **Database**: MongoDB is used as the primary database due to its flexibility and scalability.

3. **Caching**: Redis is implemented for caching to improve performance.

4. **Validation**: class-validator is used for DTO validation to ensure data integrity.

5. **Error Handling**: Custom exception filters are implemented for consistent error responses.

6. **Documentation**: Swagger is integrated for API documentation.

## API Endpoints

### Products

- `POST   api/products` - Create a new product
- `GET    api/products` - Get all products
- `GET    api/products/:id` - Get a product by ID
- `PUT    api/products/:id` - Update a product
- `DELETE api/products/:id` - Delete a product
