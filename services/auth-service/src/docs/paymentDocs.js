module.exports = {
    "/payment/history": {
        get: {
            summary: "Fetch Payment History of Orders",
            description: "Fetch Payment History of Orders",
            tags: ["Paymnet-History"],
            parameters: [
                {
                    name: "userId",
                    in: "query",
                    required: false,
                    schema: {
                        type: "string"
                        },
                    description: "user id"
                },
                {
                    name: "type",
                    in: "query",
                    required: false,
                    schema: {
                        type: "string"
                    },
                    description: "type of the user"
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
                {
                    name: "startingDate",
                    in: "query",
                    required: false,
                    schema: {
                        type: "string"
                    },
                    description: "date: search from starting date"
                },
                {
                    name: "endingDate",
                    in: "query",
                    required: false,
                    schema: {
                        type: "string"
                    },
                    description: "date: search till ending date"
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
                    name: "offset",
                    in: "query",
                    required: false,
                    schema: {
                        type: "integer",
                    },
                    description: "offset value",
                },
                {
                    name: "limit",
                    in: "query",
                    required: false,
                    schema: {
                        type: "integer",
                    },
                    description: "limit value",
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
    "/payment/history/tasker": {
        get: {
            summary: "Fetch Payment History of taskers",
            description: "Fetch Payment History of taskers",
            tags: ["Paymnet-History"],
            parameters: [
                {
                    name: "multipleStatus",
                    in: "query",
                    required: false,
                    schema: {
                        type: "string",
                        example: "COMPLETED,IN_REVISION"
                    },
                    description: "search order by multiple status"
                },
                {
                    name: "paymentType",
                    in: "query",
                    required: false,
                    schema: {
                        type: "string"
                    },
                    description: "type of the payment"
                },
                {
                    name: "offset",
                    in: "query",
                    required: false,
                    schema: {
                        type: "integer",
                    },
                    description: "offset value",
                },
                {
                    name: "limit",
                    in: "query",
                    required: false,
                    schema: {
                        type: "integer",
                    },
                    description: "limit value",
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
};
