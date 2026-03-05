module.exports = {
    "/event": {
        post: {
            summary: "Create a new Event",
            description:
                "Creates a new event",
            tags: ["Events"],
            security: [{ BearerAuth: [] }], // Requires JWT token
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            required: [
                                "name",
                                "flyer",
                                "price",
                                "eventLocations",
                            ],
                            properties: {
                                name: {
                                    type: "string",
                                    example: "Magic Show Kids",
                                },
                                flyer: {
                                    type: "string",
                                    example: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNpZvOmsH-Iu4mAMP5dbWosgdoAUtBb6yHxQ&s",
                                },
                                price: {
                                    type: "number",
                                    format: "double",
                                    example: 120.50
                                },
                                eventLocations: {
                                    type: "string",
                                    example: "Galle Beach",
                                },
                            },
                        },
                    },
                },
            },
            responses: {
                201: {
                    description: "Successful response"
                },
                400: {
                    description: "Bad Request"
                }
            }
        },
    },
    "/event/all": {
        get: {
            summary: "Fetch all events",
            description: "Fetch all available Events",
            tags: ["Events"],
            parameters: [
                {
                    name: "title",
                    in: "query",
                    required: false,
                    schema: {
                        type: "string",
                    },
                    description: "event title",
                },
                {
                    name: "category",
                    in: "query",
                    required: false,
                    schema: {
                        type: "string",
                    },
                    description: "category",
                },
                {
                    name: "status",
                    in: "query",
                    required: false,
                    schema: {
                        type: "string",
                    },
                    description: "event title",
                },
                {
                    name: "location",
                    in: "query",
                    required: false,
                    schema: {
                        type: "string",
                    },
                    description: "address of the event",
                },
                {
                    name: "date",
                    in: "query",
                    required: false,
                    schema: {
                        type: "string",
                    },
                    description: "date: search by created date",
                },
                {
                    name: "isOrders",
                    in: "query",
                    required: false,
                    schema: {
                        type: "boolean",
                        example: false,
                    },
                    description: "search user specific bokked events",
                },
                {
                    name: "serviceProviderId",
                    in: "query",
                    required: false,
                    description: "service provider id",
                },
                {
                    name: "limit",
                    in: "query",
                    required: false,
                    schema: {
                        type: "integer",
                        example: "10",
                    },
                    description: "limit value",
                },
                {
                    name: "offset",
                    in: "query",
                    required: false,
                    schema: {
                        type: "integer",
                        example: "0",
                    },
                    description: "offset value",
                },
            ],
            security: [{ BearerAuth: [] }], // Requires JWT token
            requestBody: {
                required: false,
                content: {},
            },
            responses: {
                200: {
                    description: "Successful response"
                },
                400: {
                    description: "Bad Request"
                }
            }
        },
    },
    "/event/user/{id}":{
        get: {
            summary: "Get a event by id",
            tags: ["Events"],
            parameters: [
                {
                    name:"id",
                    in:"path",
                    required: true,
                    description: "The event id is required.",
                    schema: {
                        type: "string",
                        example: "6862ac2b4fee7b17ee6313f4",
                    },
                },
                {
                    name: "limit",
                    in: "query",
                    required: false,
                    schema: {
                        type: "integer",
                        example: "10",
                    },
                    description: "limit value",
                },
                {
                    name: "offset",
                    in: "query",
                    required: false,
                    schema: {
                        type: "integer",
                        example: "0",
                    },
                    description: "offset value",
                },
            ],
            security: [{ BearerAuth: [] }], // Requires JWT token
            requestBody: {
                required: false,
                content: {},
            },
            responses: {
                200: {
                    description: "Successful response"
                },
                400: {
                    description: "Bad Request"
                }
            }
        },
    },
    "/event/organizer/{id}": {
        get: {
            summary: "Fetch organizer of the event",
            description:
                "Fetch the organizer profile",
            tags: ["Events"],
            security: [
                {
                    BearerAuth: []
                }
            ],
            parameters:[
                {
                    name: "id",
                    in: "path",
                    required: true,
                    schema: {
                        type: "string",
                        example: "69a914e30b1056411751f1a0"
                    },
                    description: "id"
                },
            ],
            responses: {
                200: {
                    description: "Successful response"
                },
                400: {
                    description: "Bad Request"
                }
            }
        },
    },
    "/event/book-event": {
        post: {
            summary: "Book an event",
            description: "Book an new Event By user",
            tags: ["Events"],
            security: [{ BearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    "application/json":{
                        schema: {
                            type:"object",
                            required: [
                                "eventId"
                            ],
                            properties: {
                                eventId : {
                                    type: "string",
                                    example: "event Id",
                                },
                            },
                        },
                    },
                },
            },
            responses: {},
        },
    },
};
