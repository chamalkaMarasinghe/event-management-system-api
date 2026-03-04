module.exports = {
    "/review/{id}":{
        post:{
            summary: "Create a new Review",
            description: 
                "Create a new Review",
            tags:['Reviews'],
            security: [{BearerAuth: []}],
            parameters:[
                {
                    name:"id",
                    in:"path",
                    required:true,
                    description: "The event id is required.",
                    schema:{type: "string" }
                }
            ],
            requestBody:{
                required: true,
                content: {
                    "application/json":{
                        schema: {
                            type: "object",
                            required: [
                                "feedback",
                                "rating",
                                "event"
                            ],
                            properties: {
                                feedback: {
                                    type: "string",
                                    example: " This is good event excellent"
                                },
                                rating: {
                                    type : "number",
                                    example: 5
                                },
                            }
                        }
                    }
                }
            },
            responses: {},
        },
        
    },
    "/review/service-pro/{id}":{
        get:{
            summary: "Get Reviews",
            description:
                "Get Reviews",
            tags:['Reviews'],
            security:[{BearerAuth:[]}],
            parameters:  [
                {
                    name:"id",
                    in:"path",
                    required:true,
                    description: "The servicepro id is required.",
                    schema:{type: "string" }
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
            ],
            responses: {}
        }
    },
    "/review/admin/service-pro/{id}":{
        get:{
            summary: "Get Reviews",
            description:
                "Get Reviews",
            tags:['Reviews'],
            security:[{BearerAuth:[]}],
            parameters:  [
                {
                    name:"id",
                    in:"path",
                    required:true,
                    description: "The servicepro id is required.",
                    schema:{type: "string" }
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
            ],
            responses: {}
        }
    }
}