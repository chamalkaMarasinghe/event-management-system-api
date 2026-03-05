const swaggerJSDoc = require("swagger-jsdoc");
const authDocs = require("../docs/authDocs");
const currentEnvironment = require('./environmentConfig');
const BASE_URL = currentEnvironment.BASE_URL;
const API_VERSION = currentEnvironment.API_VERSION;

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "KidsPlan Auth Service",
            version: "1.0.0",
            description: "API documentation of the KidsPlan API Auth service",
        },
        paths: {
            ...authDocs,
        },
        servers: [{ url: `${BASE_URL}/api/v${API_VERSION}` }],
        components: {
            securitySchemes: {
                BearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
                },
            },
        },
        // security: [{ BearerAuth: [] }], // Applies to all endpoints
    },
  apis: ["./routes/*.js"], // Path to route files with Swagger annotations
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;