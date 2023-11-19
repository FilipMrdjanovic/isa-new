# ISA

This repository contains the backend and frontend code for provided application. The backend is built using Java with Spring Boot, while the frontend is built using React with TypeScript. This README provides an overview of the project structure, dependencies, and how to set up and run both the backend and frontend components.

## Backend (Java with Spring Boot)

### Prerequisites
- Java 17
- Maven

### Getting Started
1. Open a terminal and navigate to the `backend` directory.
2. Run the following command to build and run the backend application:

 ```shell
mvn spring-boot:run
```
### Dependencies
- Spring Boot Starter Data JPA
- Spring Boot Starter Security 6
- Spring Boot Starter Web
- JSON Web Token (JWT) libraries
- PostgreSQL driver
- Lombok (optional)
- Jakarta Validation API

## Frontend (React with TypeScript)

### Prerequisites
- Node.js
- npm

### Getting Started
1. Open a terminal and navigate to the `frontend` directory.
2. Run the following commands to set up and start the frontend development server:

 ```shell
npm install
```

```shell
npm run dev
```

### Dependencies
- React
- React Router 6
- Material-UI components and styles
- Axios
- JWT Decode
- Styled Components
- Emotion

### Development Dependencies
- TypeScript
- ESLint with TypeScript support
- Vite development server

## Project Structure

```plaintext
project-root/
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── ... (backend Java source files)
│   │   │   ├── resources/
│   │   │   │   └── application.properties
│   │   ├── test/
│   │   │   └── ... (backend test files)
│   │   └── pom.xml
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── helpers/
│   │   ├── hooks/
│   │   ├── layout/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── styles/
│   │   ├── theme/
│   │   ├── types/
│   │   ├── views/
│   │   ├── App.tsx
│   │   └── index.tsx
│   ├── tsconfig.json
│   ├── package.json
│   └── vite.config.js
├── .gitignore
└── README.md

```
