/***
 * 
 * ============== THREAD ENDPOINTS DOCUMENTATION =====================================================
 * 
 */

module.exports = {
    "/thread/{serviceprovider}": { // documentation for thread/:user2/ - creating unique communication thread between two users
        post: {
            summary: "Create new thread",
            description: "Creating unique communication thread between two users - user start chat with service provider",
            tags: ["Thread"],
            security: [
                {
                    BearerAuth: []
                }
            ],
            parameters: [
                {
                    name: "serviceprovider",
                    in: "path",
                    required: true,
                    schema: {
                        type: "string"
                    },
                    description: "service provider id"
                },
            ],
            requestBody: {
                required: false,
                content: {},
            },
            responses: {},
        },
    },
    "/thread": { // documentation for thread - Fetching, filtering, threads
        get: {
            summary: "Fetch user threads",
            description: "Fetch user threads according to different criterias like sorting, searching, filtering and quering",
            tags: ["Thread"],
            parameters: [
                {
                    name: "offset",
                    in: "query",
                    required: false,
                    schema: {
                        type: "integer",
                    },
                    description: "offset value"
                },
                {
                    name: "limit",
                    in: "query",
                    required: false,
                    schema: {
                        type: "integer",
                    },
                    description: "limit value"
                },
                {
                    name: "userName",
                    in: "query",
                    required: false,
                    schema: {
                        type: "string"
                    },
                    description: "user name: search by name of the user"
                },
            ],
            security: [
                {
                BearerAuth: []
                }
            ],
            requestBody: {
                required: false,
                content: {},
            },
            responses: {},
        },
    },
    "/thread/{thread}": { // documentation for thread by id
        get: {
            summary: "Fetch user thread by ID",
            description: "Fetch user thread by ID",
            tags: ["Thread"],
            parameters: [
                {
                    name: "thread",
                    in: "path",
                    required: true,
                    schema: {
                        type: "string",
                    },
                    description: "Thread id"
                },
            ],
            security: [
                {
                BearerAuth: []
                }
            ],
            requestBody: {
                required: false,
                content: {},
            },
            responses: {},
        },
    },
    "/thread/{thread}/chats/user": { // documentation for thread chats - Fetching, filtering, thread chats
        get: {
            summary: "Fetch user/tasker thread chats",
            description: "Fetch user/tasker thread chats according to different criterias like sorting, searching, filtering and quering",
            tags: ["Thread"],
            parameters: [
                {
                    name: "thread",
                    in: "path",
                    required: true,
                    schema: {
                        type: "string",
                    },
                    description: "Thread id"
                },
                {
                    name: "offset",
                    in: "query",
                    required: false,
                    schema: {
                        type: "integer",
                    },
                    description: "offset value"
                },
                {
                    name: "limit",
                    in: "query",
                    required: false,
                    schema: {
                        type: "integer",
                    },
                    description: "limit value"
                },
            ],
            security: [
                {
                BearerAuth: []
                }
            ],
            requestBody: {
                required: false,
                content: {},
            },
            responses: {},
        },
    },
    "/thread/unread": {
        get: {
            summary: "Fetch number of unread threads count",
            description: "Fetch number of unread threads count",
            tags: ["Thread"],
            parameters: [],
            security: [
                {
                    BearerAuth: []
                }
            ],
            requestBody: {
                required: false,
                content: {},
            },
            responses: {},
        },
    },
};
