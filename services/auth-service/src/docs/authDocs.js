module.exports = {
    "/auth/signup/user": { 
        post: {
            summary: "Signup as User",
            description:
                "Signup a user to the system as a regular authenticated user",
            tags: ["Authentication-User"],
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
                                phoneNumber: {
                                    type: "string",
                                    example: "0331232123",
                                },
                                email: {
                                    type: "string",
                                    example: "chamalkaauth@freesourcecodes.com",
                                },
                                password: {
                                    type: "string",
                                    example: "#taskerPassword99",
                                },
                                // profilePicture: {
                                //     type: "string",
                                //     example: "https://youtube.com",
                                // }
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
    "/auth/signin/user": {
        post: {
            summary: "Signin as User",
            description:
                "Signin a user to the system as a regular authenticated user or tasker",
            tags: ["Authentication-User"],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                email: {
                                    type: "string",
                                    example: "chamalkaauth@freesourcecodes.com",
                                },
                                password: {
                                    type: "string",
                                    example: "#taskerPassword99",
                                },
                            },
                        },
                    },
                },
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
};
