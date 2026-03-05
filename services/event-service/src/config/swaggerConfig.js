const swaggerJSDoc = require("swagger-jsdoc");
const currentEnvironment = require('./environmentConfig');
const eventDocs = require("../docs/eventDocs");
const BASE_URL = currentEnvironment.BASE_URL;
const API_VERSION = currentEnvironment.API_VERSION;

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "KidsPlan Event Service",
            version: "1.0.0",
            description: "API documentation of the KidsPlan API Event service",
        },
        paths: {
            ...eventDocs,
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