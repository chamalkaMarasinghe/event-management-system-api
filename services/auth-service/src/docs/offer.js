/***
 * 
 * ============== OFFER ENDPOINTS DOCUMENTATION =====================================================
 * 
 */

module.exports = {
    "/offer/{thread}/{offer}/{user}": { // documentation for offer/:thread/:offer/:user - accept offer by the reciever
        post: {
            summary: "Accept the offer",
            description: "Accept the offer by it's reciever",
            tags: ["Offer"],
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
                    name: "offer",
                    in: "path",
                    required: true,
                    schema: {
                        type: "string",
                    },
                    description: "Offer id"
                },
                {
                    name: "user",
                    in: "path",
                    required: true,
                    schema: {
                        type: "string",
                    },
                    description: "Receiveing usre id"
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
    "/offer/{offerId}": {
        get: {
            summary: "get the offer by id",
            description: "get the offer by it's id",
            tags: ["Offer"],
            parameters: [
                {
                    name: "offerId",
                    in: "path",
                    required: true,
                    schema: {
                        type: "string",
                    },
                    description: "Offer id"
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

};
