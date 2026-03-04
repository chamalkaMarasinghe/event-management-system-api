const { rolesForInquiry, paymentTypes } = require("../constants/commonConstants");

/***
 *
 * ============== USER ENDPOINTS DOCUMENTATION =====================================================
 *
 */

module.exports = {
    "/user": {
        get: {
            summary: "Fetch all Clients users",
            description: "Fetch all available client user",
            tags: ["User"],
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
    "/user/profile/":{
        get:{
            summary: "Get User Profile",
            description:
                "Get the profile of a user",
            tags: ["User"],
            security: [
                {
                    BearerAuth: []
                }
            ],
            responses: {}
        }
    },
    "/user/profile/{userId}": {
        get: {
            summary: "Get specific client user by ID (Admin only)",
            description: "Fetch a specific client user's profile by their user ID. Only accessible by admin users.",
            tags: ["User"],
            parameters: [
                {
                    name: "userId",
                    in: "path",
                    required: true,
                    schema: {
                        type: "string",
                        example: "6870db785d6e22d73e4b12cc",
                    },
                    description: "User ID - must be a valid MongoDB ObjectId",
                },
            ],
            security: [{ BearerAuth: [] }],
            requestBody: {
                required: false,
                content: {},
            },
            responses:{},
        }
    },
    "/user/edit-profile/":{
        put:{
            summary:"Update User Profile",
            description:"Edit the user profile with new data",
            tags:["User"],
            security:[
                {
                    BearerAuth:[]
                }
            ],
            requestBody:{
                required:true,
                content:{
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                firstName: {
                                    type: "string",
                                    example: "Chamalka",
                                },
                                lastName: {
                                    type: "string",
                                    example: "Marasinghe",
                                },
                                phoneNumber: {
                                    type: "string",
                                    example: "0331232123",
                                },
                                profilePicture: {
                                    type: "string",
                                    example: "https://youtub.com",
                                },
                                email: {
                                    type: "string",
                                    example: "chamalkaauth@freesourcecodes.com",
                                },
                                city: {
                                    type: "string",
                                    example: "Colombo ",
                                },
                            }
                        }
                    }
                }
            },
            responses:{}
        }
    },
    "/user/delete/{userId}": {
        delete: {
            summary: "Delete specific client user by ID (Admin only)",
            description: "Soft delete a specific client user by their user ID. Sets isDeleted flag to true instead of permanently removing the record. Only accessible by admin users.",
            tags: ["User"],
            parameters: [
                {
                    name: "userId",
                    in: "path",
                    required: true,
                    schema: {
                        type: "string",
                        example: "6870db785d6e22d73e4b12cc",
                    },
                    description: "User ID - must be a valid MongoDB ObjectId",
                },
            ],
            security: [{ BearerAuth: [] }],
            requestBody: {
                required: false,
                content: {},
            },
            responses:{},
        }
    },
    "/user/contact": {
        post: {
            summary: "Submit Contact Form",
            description: "Submit a contact form message. Can be used by both authenticated and non-authenticated users.",
            tags: ["User"],
            security: [
                {
                    BearerAuth: []
                }
            ],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                firstName: {
                                    type: "string",
                                    example: "Chamalka",
                                },
                                lastName: {
                                    type: "string",
                                    example: "Marasinghe",
                                },
                                email: {
                                    type: "string",
                                    example: "chamalkaauth@freesourcecodes.com",
                                },
                                subject: {
                                    type: "string",
                                    example: "General Inquiry",
                                },
                                message: {
                                    type: "string",
                                    example: "Hello, I have a question about your services.",
                                }
                            }
                        }
                    }
                }
            },
            responses: {}
        }
    },
    "/user/wishlist/add": {
        patch: {
            summary: "Add Event to Wishlist",
            description: "Add an event to the authenticated user's wishlist. The event must exist and not already be wishlisted by the user.",
            tags: ["User"],
            security: [
                { BearerAuth: [] }
            ],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                eventId: {
                                    type: "string",
                                    example: "60d21b4667d0d8992e610c85",
                                    description: "The ID of the event to add. Must be a non-empty string."
                                }
                            },
                            required: ["eventId"]
                        }
                    }
                }
            },
            responses: {
                204: {
                    description: "Event wishlisted successfully. No content returned."
                },
                400: {
                    description: "Validation error (e.g., eventId missing or not a string)."
                },
                401: {
                    description: "Unauthorized. User must be logged in."
                },
                404: {
                    description: "Event not found."
                },
                409: {
                    description: "Event already wishlisted."
                }
            }
        }
    },
    "/user/wishlist/remove": {
        patch: {
            summary: "Remove Event from Wishlist",
            description: "Remove an event from the authenticated user's wishlist. The event must already be in the wishlist.",
            tags: ["User"],
            security: [
                { BearerAuth: [] }
            ],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                eventId: {
                                    type: "string",
                                    example: "60d21b4667d0d8992e610c85",
                                    description: "The ID of the event to remove. Must be a non-empty string."
                                }
                            },
                            required: ["eventId"]
                        }
                    }
                }
            },
            responses: {
                204: {
                    description: "Event removed from wishlist successfully. No content returned."
                },
                400: {
                    description: "Validation error (e.g., eventId missing or not a string)."
                },
                401: {
                    description: "Unauthorized. User must be logged in."
                },
                404: {
                    description: "Wishlisted event not found."
                }
            }
        }
    }
};