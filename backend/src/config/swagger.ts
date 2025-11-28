import swaggerJsdoc from "swagger-jsdoc";
import path from "path";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Trello-like API",
      version: "1.0.0",
      description: "API documentation for boards, lists, and tasks",
    },
    servers: [
      {
        url: "http://localhost:5000/api",
        description: "Development server",
      },
    ],
  },

  apis: [
    path.resolve(__dirname, "../routes/**/*.ts"),
    path.resolve(__dirname, "../routes/**/*.js"),
  ],
};

export const swaggerSpec = swaggerJsdoc(options);
