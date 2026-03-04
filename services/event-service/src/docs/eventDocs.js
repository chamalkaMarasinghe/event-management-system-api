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
                                "price",
                                "category",
                                "paymentMethod",
                                "description",
                                "maximumAttendees",
                                "eventType",
                                "schedulingType",
                                "paymentMethod",
                                "eventLocations",
                            ],
                            properties: {
                                name: {
                                    type: "string",
                                    example: "Magic Show",
                                },
                                price: {
                                    type: "number",
                                    format: "double",
                                    example: 120.50
                                },
                                category: {
                                    type: "string",
                                    example: "Entertainment",
                                },
                                paymentMethod: {
                                    type: "string",
                                    example: "ONLINE",

                                    type: "array",
                                    items: { type: "string" },
                                    example: ["ONLINE", "INHOUSE"],
                                },
                                description: {
                                    type: "string",
                                    example: "Good kids show",
                                },
                                maximumAttendees: {
                                    type: "integer",
                                    minimum: 1,
                                    example: 20
                                },
                                flyer: {
                                    type: "array",
                                    items: { type: "string" },
                                    example: [
                                        "https://example.com/image1.jpg",
                                        "https://example.com/image2.png",
                                    ],
                                },
                                eventType: {
                                    type: "string",
                                    example: "PUBLIC",
                                },
                                eventLocations: {
                                    type: "array",
                                    items: {
                                        type: "object",
                                        properties: {
                                            address: {
                                                type: "string",
                                                example:
                                                    "123 Main Street, New York, NY",
                                            },
                                            placeId: {
                                                type: "string",
                                                example: "ChIJN1t_tDeuEmsRUsoyG83frY4"
                                            },
                                            location: {
                                                type: "object",
                                                properties: {
                                                    type: {
                                                        type: "string",
                                                        enum: ["Point"],
                                                        example: "Point",
                                                    },
                                                    coordinates: {
                                                        type: "array",
                                                        items: {
                                                            type: "number"
                                                        },
                                                        example: [79.8612, 6.9271] // [longitude, latitude]
                                                    }
                                                },
                                                required: ["type", "coordinates"]
                                            }
                                        },
                                        required: ["address"]
                                    }
                                },
                                date: {
                                    type: "string",
                                    format: "date",
                                    example: "2025-06-15",
                                },
                                eventStartDate: {
                                    type: "string",
                                    format: "date",
                                    example: "2025-06-15",
                                },
                                eventEndDate: {
                                    type: "string",
                                    format: "date",
                                    example: "2025-06-15",
                                },
                                startingTime: {
                                    type: "string",
                                    example: "14:30",
                                },
                                endingTime: {
                                    type: "string",
                                    example: "14:31",
                                },
                                schedulingType: {
                                    type: "string",
                                    example: "ONETIME",
                                },
                                // recurringFrequency: {
                                //     type: "string",
                                //     example: "WEEKLY",
                                // },
                                // numberOfReccuringEvents: {
                                //     type: "integer",
                                //     minimum: 1,
                                //     example: 3
                                // },
                                // lastDayOfPayment: {
                                //     type: "integer",
                                //     minimum: 1,
                                //     maximum: 31,
                                //     example: 10
                                // },
                                // eventEndDate: {
                                //     type: "string",
                                //     format: "date",
                                //     example: "2025-06-15",
                                // },
                            },
                        },
                    },
                },
            },
            responses: {},
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
                        example: "COMPLETED", // COMPLETED || UPCOMING
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
                        example: "2025-06-15",
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
            responses: {},
        },
        responses: {}
    },
    "/event/all/service-pro": {
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
                        example: "COMPLETED", // COMPLETED || UPCOMING
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
                        example: "2025-06-15",
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
            responses: {},
        },
        responses: {}
    },
    // },
    "/event/calendar": {
        get: {
            summary: "Fetch the event calendar",
            description: "Fetch the event calendar for the service provider",
            tags: ["Events"],
            parameters: [
                {
                    name: "startingDate",
                    in: "query",
                    required: true,
                    schema: {
                        type: "string",
                        example: "2025-06-15",
                    },
                },
                {
                    name: "endingDate",
                    in: "query",
                    required: true,
                    schema: {
                        type: "string",
                        example: "2025-06-15",
                    },
                },
            ],
            security: [{ BearerAuth: [] }], // Requires JWT token
            requestBody: {
                required: false,
                content: {},
            },
            responses: {},
        },
        responses: {}
    },
    "/event/booking-report": {
        get: {
            summary: "Fetch Booking report for admin",
            description: "Fetch booking report for admin",
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
                    name: "status",
                    in: "query",
                    required: false,
                    schema: {
                        type: "string",
                        example: "COMPLETED", // COMPLETED || UPCOMING
                    },
                    description: "event title",
                },
                {
                    name: "category",
                    in: "query",
                    required: false,
                    schema: {
                        type: "string"
                        },
                    description: "category"
                },
                {
                    name: "startingDate",
                    in: "query",
                    required: false,
                    schema: {
                        type: "string",
                        example: "2025-06-15"
                    },
                    description: "date: search by created date"
                },
                {
                    name: "endingDate",
                    in: "query",
                    required: false,
                    schema: {
                        type: "string",
                        example: "2025-06-15"
                    },
                    description: "date: search by created date"
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
            responses: {},
        },
    },
    "/event/edit-event/{id}": {
        patch: {
            summary: "Edit a Event",
            description: "Edit an existing event",
            tags: ["Events"],
            security: [{ BearerAuth: [] }], // Requires JWT token
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    description: "The event id is required.",
                    schema: { type: "string" },
                },
            ],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            required: [
                                "name",
                                "price",
                                "category",
                                "paymentMethod",
                                "description",
                                "maximumAttendees",
                            ],
                            properties: {
                                name: {
                                    type: "string",
                                    example: "Magic Show",
                                },
                                price: {
                                    type: "number",
                                    format: "double",
                                    example: 120.50
                                },
                                category: {
                                    type: "string",
                                    example: "Entertainment",
                                },
                                paymentMethod: {
                                    type: "string",
                                    example: "ONLINE",
                                },
                                description: {
                                    type: "string",
                                    example: "Good kids show",
                                },
                                maximumAttendees: {
                                    type: "integer",
                                    minimum: 1,
                                    example: 20
                                },
                                flyer: {
                                    type: "array",
                                    items: { type: "string" },
                                    example: [
                                        "https://example.com/image1.jpg",
                                        "https://example.com/image2.png",
                                    ],
                                },
                                eventLocations: {
                                    type: "array",
                                    items: {
                                        type: "object",
                                        properties: {
                                            address: {
                                                type: "string",
                                                example:
                                                    "123 Main Street, New York, NY",
                                            },
                                            placeId: {
                                                type: "string",
                                                example: "ChIJN1t_tDeuEmsRUsoyG83frY4"
                                            },
                                            location: {
                                                type: "object",
                                                properties: {
                                                    type: {
                                                        type: "string",
                                                        enum: ["Point"],
                                                        example: "Point"
                                                    },
                                                    coordinates: {
                                                        type: "array",
                                                        items: {
                                                            type: "number"
                                                        },
                                                        example: [79.8612, 6.9271] // [longitude, latitude]
                                                    }
                                                },
                                                required: ["type", "coordinates"]
                                            }
                                        },
                                        required: ["address"]
                                    }
                                },
                                date: {
                                    type: "string",
                                    format: "date",
                                    example: "2025-06-15",
                                },
                                startingTime: {
                                    type: "string",
                                    example: "14:30",
                                },
                                endingTime: {
                                    type: "string",
                                    example: "14:31",
                                },
                            },
                        },
                    },
                },
            },
            responses: {},
        },
    },
    "/event/user/{id}":{
        get: {
            summary: "Get a event by user",
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
            responses: {},
        },
    },
    "/event/service-pro/{id}":{
        get: {
            summary: "Fetch all event all attendees",
            description: "Fetch all available Event all attendees",
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
                    name: "status",
                    in: "query",
                    required: false,
                    schema: {
                        type: "string",
                        example: "COMPLETED", // COMPLETED || UPCOMING
                    },
                    description: "event title",
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
            responses: {},
        },
    },
    "/event/user/{id}": {
        get: {
            summary: "Get a event by user",
            tags: ["Events"],
            security: [{ BearerAuth: [] }], // Requires the JWT token
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    description: "The event Id is required",
                },
            ],
            responses: {},
        },
    },
    "/event/service-pro/{id}": {
        get: {
            summary: "Get a event by service provider",
            tags: ["Events"],
            security: [{ BearerAuth: [] }], // Requires the JWT token
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    description: "The event Id is required",
                },
            ],
            responses: {},
        },
    },
    "/event/book-event": {
        post: {
            summary: "Book a event",
            description: "Book a new Event By user",
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
    "/event/cancel/{id}": {
        patch: {
            summary: "Cancel the event",
            tags: ["Events"],
            security: [{ BearerAuth: [] }], // Requires the JWT token
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    description: "The event Id is required",
                },
            ],
            responses: {},
        },
    },
    "/event/{id}": {
        "delete": {
            "summary": "Delete an event",
            "description": "Allows an admin to delete an event",
            "tags": ["Events"],
            "security": [{ "BearerAuth": [] }],
            "parameters": [
            {
                "name": "id",
                "in": "path",
                "required": true,
                "schema": {
                    "type": "string",
                },
            }
            ],
            "responses": {}
        }
    },
    "/event/complaint": {
        get: {
            summary: "Fetch all complaints",
            description: "Fetch all available Complaints",
            tags: ["Events"],
            parameters: [
                {
                name: "title",
                in: "query",
                required: false,
                schema: {
                    type: "string"
                    },
                description: "event title"
                },
                {
                name: "category",
                in: "query",
                required: false,
                schema: {
                    type: "string"
                    },
                description: "category"
                },
                {
                name: "startingDate",
                in: "query",
                required: false,
                schema: {
                    type: "string",
                    example: "2025-06-15"
                },
                description: "date: search by created date"
                },
                {
                name: "endingDate",
                in: "query",
                required: false,
                schema: {
                    type: "string",
                    example: "2025-06-15"
                },
                description: "date: search by created date"
                },
                {
                name: "limit",
                in: "query",
                required: false,
                schema: {
                    type: "integer",
                    example:"10",
                },
                description: "limit value"
                },
                {
                name: "offset",
                in: "query",
                required: false,
                schema: {
                    type: "integer",
                    example:"0",
                },
                description: "offset value"
                },
            ],
            security: [{ BearerAuth: [] }], // Requires JWT token
            requestBody: {
                required: false,
                content: {}
            },
            responses: {}
        },
        "post": {
            "summary": "Raise a complaint for an event",
            "description": "Allows a user to raise a complaint for an event",
            "tags": ["Events"],
            "security": [{ "BearerAuth": [] }],
            "requestBody": {
            "required": true,
            "content": {
                "application/json": {
                "schema": {
                    "type": "object",
                    "required": ["eventId", "complaintType", "description", "clientName", "clientEmail"],
                    "properties": {
                    "eventId": {
                        "type": "string",
                        "example": "60d5f3f5c7b4e12b8c9d7e2f",
                        "pattern": "^[0-9a-fA-F]{24}$"
                    },
                    "complaintType": {
                        "type": "string",
                        "enum": ["Product Issue", "Service Complaint", "Billing Problem", "Delivery Delay", "Other"],
                        "example": "Service Complaint"
                    },
                    "description": {
                        "type": "string",
                        "example": "Event was not as described",
                        "maxLength": 500
                    },
                    "attachment": {
                        "type": "string",
                        "format": "uri",
                        "example": "https://example.com/attachment.jpg"
                    },
                    "clientName": {
                        "type": "string",
                        "example": "John Doe"
                    },
                    "clientEmail": {
                        "type": "string",
                        "format": "email",
                        "example": "john.doe@example.com"
                    }
                    }
                }
                }
            }
            },
            "responses": {
            "201": {
                "description": "Complaint successfully created"
            },
            "400": {
                "description": "Invalid request"
            }
            }
        },
    },
    "/event/complaint/{id}": {
        "get": {
            "summary": "Get complaint by ID",
            "description": "Allows an admin to fetch a specific complaint",
            "tags": ["Events"],
            "security": [{ "BearerAuth": [] }],
            "parameters": [
            {
                "name": "id",
                "in": "path",
                "required": true,
                "schema": {
                "type": "string",
                "pattern": "^[0-9a-fA-F]{24}$"
                },
                "example": "68672caaecc19300e6fad830"
            }
            ],
            "responses": {
            "200": {
                "description": "Complaint found"
            },
            "404": {
                "description": "Complaint not found"
            }
            }
        },
        "delete": {
            "summary": "Delete a complaint",
            "description": "Allows an admin to delete a specific complaint",
            "tags": ["Events"],
            "security": [{ "BearerAuth": [] }],
            "parameters": [
            {
                "name": "id",
                "in": "path",
                "required": true,
                "schema": {
                "type": "string",
                "pattern": "^[0-9a-fA-F]{24}$"
                },
                "example": "68672caaecc19300e6fad830"
            }
            ],
            "responses": {
            "200": {
                "description": "Complaint deleted"
            },
            "404": {
                "description": "Complaint not found"
            },
            "403": {
                "description": "Unauthorized"
            }
            }
        }
    },
    "/event/complaint/resolve/{id}": {
        "put": {
            "summary": "Resolve a complaint by an admin",
            "description": "Allows an admin to resolve a complaint",
            "tags": ["Events"],
            "security": [{ "BearerAuth": [] }],
            "parameters": [
                {
                    "name": "id",
                    "in": "path",
                    "required": true,
                    "description": "The event-complaint Id is required",
                },
            ],
            "requestBody": {
                "required": false,
                "content": {}
            },
            "responses": {
            "200": {
                "description": "Complaint resolved"
            },
            "400": {
                "description": "Invalid request"
            },
            "403": {
                "description": "Unauthorized"
            }
            }
        }
    }


    // NOTE: from jumaconnect >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

    // "/jobpost/{jobPostId}": {
    //     get: {
    //         summary: "Get a single job post",
    //         description:
    //             "Fetches details of a specific job post using the provided jobPostId.",
    //         tags: ["Job Post"],
    //         security: [{ BearerAuth: [] }],
    //         parameters: [
    //             {
    //                 name: "jobPostId",
    //                 in: "path",
    //                 required: true,
    //                 description: "The jobPost ID of the job post to fetch",
    //                 schema: { type: "string" },
    //             },
    //         ],
    //         responses: {
    //             200: {
    //                 description: "Job post fetched successfully",
    //                 content: {
    //                     "application/json": {
    //                         schema: {
    //                             type: "object",
    //                             properties: {
    //                                 status: { type: "integer", example: 200 },
    //                                 message: {
    //                                     type: "string",
    //                                     example:
    //                                         "Job post fetched successfully",
    //                                 },
    //                                 data: { type: "object" },
    //                             },
    //                         },
    //                     },
    //                 },
    //             },
    //         },
    //     },
    //     put: {
    //         summary: "Edit a job post",
    //         description:
    //             "Updates an existing job post based on the provided jobPostId.",
    //         tags: ["Job Post"],
    //         security: [{ BearerAuth: [] }], // Requires JWT token
    //         parameters: [
    //             {
    //                 name: "jobPostId",
    //                 in: "path",
    //                 required: true,
    //                 description: "The ID of the job post to update",
    //                 schema: {
    //                     type: "string",
    //                 },
    //             },
    //         ],
    //         requestBody: {
    //             required: true,
    //             content: {
    //                 "application/json": {
    //                     schema: {
    //                         type: "object",
    //                         required: [
    //                             "title",
    //                             "date",
    //                             "time",
    //                             "description",
    //                             "category",
    //                             "location",
    //                         ],
    //                         properties: {
    //                             title: {
    //                                 type: "string",
    //                                 example:
    //                                     "Ceiling Fan Installation and Leak Repair",
    //                             },
    //                             date: {
    //                                 type: "string",
    //                                 format: "date",
    //                                 example: "2025-07-12",
    //                             },
    //                             time: {
    //                                 type: "string",
    //                                 example: "10:00",
    //                             },
    //                             description: {
    //                                 type: "string",
    //                                 example:
    //                                     "Installing ceiling fans and fixing plumbing leaks in the house II.",
    //                             },
    //                             category: {
    //                                 type: "object",
    //                                 properties: {
    //                                     categoryItem: {
    //                                         type: "string",
    //                                         example: "Electrical Services",
    //                                     },
    //                                     skills: {
    //                                         type: "array",
    //                                         items: { type: "string" },
    //                                         example: [
    //                                             "Installing Ceiling Fans",
    //                                             "Installing Security Cameras",
    //                                         ],
    //                                     },
    //                                 },
    //                             },
    //                             location: {
    //                                 type: "object",
    //                                 properties: {
    //                                     city: {
    //                                         type: "string",
    //                                         example: "Kumasi",
    //                                     },
    //                                     subCities: {
    //                                         type: "array",
    //                                         items: { type: "string" },
    //                                         example: ["Bantama", "Suame"],
    //                                     },
    //                                 },
    //                             },
    //                             images: {
    //                                 type: "array",
    //                                 items: { type: "string" },
    //                                 example: [
    //                                     "https://example.com/ceilingfan.jpg",
    //                                     "https://example.com/leakrepair.png",
    //                                 ],
    //                             },
    //                         },
    //                     },
    //                 },
    //             },
    //         },
    //         responses: {
    //             200: {
    //                 description: "Job post updated successfully",
    //                 content: {
    //                     "application/json": {
    //                         schema: {
    //                             type: "object",
    //                             properties: {
    //                                 status: {
    //                                     type: "integer",
    //                                     example: 200,
    //                                 },
    //                                 message: {
    //                                     type: "string",
    //                                     example:
    //                                         "Job post updated successfully",
    //                                 },
    //                                 data: {
    //                                     type: "object",
    //                                     properties: {
    //                                         _id: {
    //                                             type: "string",
    //                                             example:
    //                                                 "67b04fa15596a01f9e02309a",
    //                                         },
    //                                         title: {
    //                                             type: "string",
    //                                             example:
    //                                                 "Ceiling Fan Installation and Leak Repair",
    //                                         },
    //                                         date: {
    //                                             type: "string",
    //                                             format: "date-time",
    //                                             example:
    //                                                 "2025-07-12T00:00:00.000Z",
    //                                         },
    //                                         time: {
    //                                             type: "string",
    //                                             example: "10:00",
    //                                         },
    //                                         description: {
    //                                             type: "string",
    //                                             example:
    //                                                 "Installing ceiling fans and fixing plumbing leaks in the house II.",
    //                                         },
    //                                         category: {
    //                                             type: "object",
    //                                             properties: {
    //                                                 categoryItem: {
    //                                                     type: "string",
    //                                                     example:
    //                                                         "Electrical Services",
    //                                                 },
    //                                                 skills: {
    //                                                     type: "array",
    //                                                     items: {
    //                                                         type: "string",
    //                                                     },
    //                                                     example: [
    //                                                         "Installing Ceiling Fans",
    //                                                         "Installing Security Cameras",
    //                                                     ],
    //                                                 },
    //                                             },
    //                                         },
    //                                         location: {
    //                                             type: "object",
    //                                             properties: {
    //                                                 city: {
    //                                                     type: "string",
    //                                                     example: "Kumasi",
    //                                                 },
    //                                                 subCities: {
    //                                                     type: "array",
    //                                                     items: {
    //                                                         type: "string",
    //                                                     },
    //                                                     example: [
    //                                                         "Bantama",
    //                                                         "Suame",
    //                                                     ],
    //                                                 },
    //                                             },
    //                                         },
    //                                         images: {
    //                                             type: "array",
    //                                             items: { type: "string" },
    //                                             example: [
    //                                                 "https://example.com/ceilingfan.jpg",
    //                                                 "https://example.com/leakrepair.png",
    //                                             ],
    //                                         },
    //                                         createdBy: {
    //                                             type: "string",
    //                                             example:
    //                                                 "67b04f695596a01f9e023094",
    //                                         },
    //                                         status: {
    //                                             type: "string",
    //                                             example: "ACTIVE",
    //                                         },
    //                                         isDeleted: {
    //                                             type: "boolean",
    //                                             example: false,
    //                                         },
    //                                         createdAt: {
    //                                             type: "string",
    //                                             format: "date-time",
    //                                             example:
    //                                                 "2025-02-15T08:26:09.943Z",
    //                                         },
    //                                         updatedAt: {
    //                                             type: "string",
    //                                             format: "date-time",
    //                                             example:
    //                                                 "2025-02-17T10:17:18.057Z",
    //                                         },
    //                                         __v: {
    //                                             type: "integer",
    //                                             example: 1,
    //                                         },
    //                                     },
    //                                 },
    //                             },
    //                         },
    //                     },
    //                 },
    //             },
    //         },
    //     },
    //     delete: {
    //         summary: "Delete a job post",
    //         description: "Deletes a job post by its ID.",
    //         tags: ["Job Post"],
    //         security: [{ BearerAuth: [] }], // Requires JWT token
    //         parameters: [
    //             {
    //                 name: "jobPostId",
    //                 in: "path",
    //                 required: true,
    //                 description: "The ID of the job post to delete",
    //                 schema: {
    //                     type: "string",
    //                     example: "60d5f9b6d1e4f8a3f8b7f3c1", // Example job post ID
    //                 },
    //             },
    //         ],
    //         responses: {},
    //     },
    // },
    // "/jobpost/{jobPostId}/with-matchings": {
    //     get: {
    //         summary: "Get a single job post with other matching result",
    //         description:
    //             "Fetches details of a specific job post using the provided jobPostId along with the other related job posts.",
    //         tags: ["Job Post"],
    //         security: [{ BearerAuth: [] }],
    //         parameters: [
    //             {
    //                 name: "jobPostId",
    //                 in: "path",
    //                 required: true,
    //                 description: "The jobPost ID of the job post to fetch",
    //                 schema: { type: "string" },
    //             },
    //             {
    //                 name: "city",
    //                 in: "query",
    //                 required: false,
    //                 schema: {
    //                     type: "string",
    //                 },
    //                 description: "city",
    //             },
    //             {
    //                 name: "subcity",
    //                 in: "query",
    //                 required: false,
    //                 schema: {
    //                     type: "string",
    //                 },
    //                 description: "subcity",
    //             },
    //             {
    //                 name: "category",
    //                 in: "query",
    //                 required: false,
    //                 schema: {
    //                     type: "string",
    //                 },
    //                 description: "category",
    //             },
    //             {
    //                 name: "skill",
    //                 in: "query",
    //                 required: false,
    //                 schema: {
    //                     type: "string",
    //                 },
    //                 description: "skill",
    //             },
    //         ],
    //         responses: {
    //             200: {
    //                 description: "Job post fetched successfully",
    //                 content: {
    //                     "application/json": {
    //                         schema: {
    //                             type: "object",
    //                             properties: {
    //                                 status: { type: "integer", example: 200 },
    //                                 message: {
    //                                     type: "string",
    //                                     example:
    //                                         "Job post fetched successfully",
    //                                 },
    //                                 data: { type: "object" },
    //                             },
    //                         },
    //                     },
    //                 },
    //             },
    //         },
    //     },
    // },
    // "/jobpost/user": {
    //     get: {
    //         summary: "Get all user job posts",
    //         description:
    //             "Fetches job posts associated to specific user with pagination parameters limit and offset.",
    //         tags: ["Job Post"],
    //         security: [{ BearerAuth: [] }],
    //         parameters: [
    //             {
    //                 name: "limit",
    //                 in: "query",
    //                 required: false,
    //                 description: "Number of job posts to fetch",
    //                 schema: {
    //                     type: "integer",
    //                 },
    //             },
    //             {
    //                 name: "offset",
    //                 in: "query",
    //                 required: false,
    //                 description: "Pagination offset",
    //                 schema: {
    //                     type: "integer",
    //                 },
    //             },
    //         ],
    //         responses: {
    //             200: {
    //                 description: "jobPosts Fetched Successfully.",
    //             },
    //         },
    //     },
    // },
    // "/jobpost/user/{jobPostId}": {
    //     get: {
    //         summary: "Get a single user job post",
    //         description:
    //             "Fetches details of a specific job post associated to a specific user using the provided jobPostId.",
    //         tags: ["Job Post"],
    //         security: [{ BearerAuth: [] }],
    //         parameters: [
    //             {
    //                 name: "jobPostId",
    //                 in: "path",
    //                 required: true,
    //                 description: "The jobPost ID of the job post to fetch",
    //                 schema: { type: "string" },
    //             },
    //         ],
    //         responses: {
    //             200: {
    //                 description: "Job post fetched successfully",
    //                 content: {
    //                     "application/json": {
    //                         schema: {
    //                             type: "object",
    //                             properties: {
    //                                 status: { type: "integer", example: 200 },
    //                                 message: {
    //                                     type: "string",
    //                                     example:
    //                                         "Job post fetched successfully",
    //                                 },
    //                                 data: { type: "object" },
    //                             },
    //                         },
    //                     },
    //                 },
    //             },
    //         },
    //     },
    // },
};
