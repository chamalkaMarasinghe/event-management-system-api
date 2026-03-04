const { rolesForInquiry, paymentTypes } = require("../constants/commonConstants");

module.exports = {
    "/servicepro": {
        get: {
            summary: "Fetch all service provider users",
            description: "Fetch all available service provider users",
            tags: ["Service Provider"],
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
                    name: "isRequests",
                    in: "query",
                    required: false,
                    schema: {
                        type: "boolean",
                        example: false,
                    },
                    description: "search still processing service provider requests",
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
    "/servicepro/onboard": {
        post: {
            summary: "Onboarding a service provider",
            description:
                "Onboarding a service provider to the system",
            tags: ["Service Provider"],
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

                                // Note: personal information
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
                                idType: {
                                    type: "string",
                                    example: "Type 1",
                                },
                                idNumber: {
                                    type: "string",
                                    example: "840212030200V",
                                },
                                idPhotos: {
                                    type: ["string"],
                                    example: ["https://youtube.com", "https://youtube.com"],
                                },
                                address: {
                                    type: "string",
                                    example: "welimda town, srilanka",
                                },
                                addressProof: {
                                    type: ["string"],
                                    example: ["https://youtube.com", "https://youtube.com"],
                                },

                                // Note: business information
                                name: {
                                    type: "string",
                                    example: "Chamalka pvt LTD",
                                },
                                taxID: {
                                    type: "string",
                                    example: "tax001",
                                },
                                businessAddress: {
                                    type: "string",
                                    example: "no32/1 welimada srilanka",
                                },
                                placeId: {
                                    type: "string",
                                    example: "place001",
                                },
                                longitude: {
                                    type: "number",
                                    format: "double",
                                    example: 6.123456789
                                },
                                latitude: {
                                    type: "number",
                                    format: "double",
                                    example: 6.123456789
                                },
                                logo: {
                                    type: ["string"],
                                    example: ["https://youtube.com"],
                                },
                                cover: {
                                    type: ["string"],
                                    example: ["https://youtube.com"],
                                },
                                gallery: {
                                    type: ["string"],
                                    example: ["https://youtube.com", "https://yt.com"],
                                },
                                link: {
                                    type: "string",
                                    example: "https://youtube.com",
                                },
                                expirience: {
                                    type: "Integer",
                                    example: 3
                                },
                                category: {
                                    type: "string",
                                    example: "entertainment, funny",
                                },
                                description: {
                                    type: "string",
                                    example: "stand up comedy show",
                                },
                            },
                        },
                    },
                },
            },
            responses: {},
        },
    },
    // NOTE : the verify of the service provider ....
    "/servicepro/verify/{appid}": {
        patch: {
            summary: "verify a service provider",
            description:
                "Verify a service provider to the system",
            tags: ["Service Provider"],
            security: [
                {
                    BearerAuth: []
                }
            ],
            parameters:[
                {
                    name: "appid",
                    in: "path",
                    required: true,
                    schema: {
                        type: "string"
                    },
                    description: "application id"
                },
            ],
            responses: {},
        },
    },
      // NOTE : the verify of the service provider ....
    "/servicepro/reject/{appid}": {
        patch: {
            summary: "Reject a service provider",
            description:
                "Reject a service provider from the system",
            tags: ["Service Provider"],
            security: [
                {
                    BearerAuth: []
                }
            ],
            parameters:[
                {
                    name: "appid",
                    in: "path",
                    required: true,
                    schema: {
                        type: "string"
                    },
                    description: "application id",
                },
            ],
            requestBody:{
                required:false,
                content:{
                    "application/json":{
                        schema:{
                            type:"object",
                            properties:{
                                // Note message information 
                                rejectMessage:{
                                    type:"string",
                                    example:"Your work details are incorrect",
                                }
                            }
                        }
                    }
                }
            },
            responses: {},
        },
    },
    "/servicepro/profile/":{
        get:{
            summary: "Get Admin Profile",
            description:
                "Get the profile of a admin",
            tags: ["Service Provider"],
            security: [
                {
                BearerAuth: []
                }
            ],
            responses: {}
        }
    },

    "/servicepro/edit-profile/":{
        put:{
            summary:"Update Admin Profile",
            description:"Edit the admin profile with new data",
            tags:["Service Provider"],
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
                                    example: "Kidsplan",
                                },
                                lastName: {
                                    type: "string",
                                    example: "Admin",
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
                                    example: "admin@kidsplan.com",	
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
    "/servicepro/edit-onboard":{
        put: {
            summary: "Onboarding a service provider",
            description:
                "Onboarding a service provider to the system",
            tags: ["Service Provider"],
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

                                // Note: personal information
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
                                // email: {
                                //     type: "string",
                                //     example: "chamalkaauth@freesourcecodes.com",
                                // },
                                idType: {
                                    type: "string",
                                    example: "Type 1",
                                },
                                // idNumber: {
                                //     type: "string",
                                //     example: "840212030200V",
                                // },
                                idPhotos: {
                                    type: ["string"],
                                    example: ["https://youtube.com", "https://youtube.com"],
                                },
                                address: {
                                    type: "string",
                                    example: "welimda town, srilanka",
                                },
                                addressProof: {
                                    type: ["string"],
                                    example: ["https://youtube.com", "https://youtube.com"],
                                },

                                // Note: business information
                                name: {
                                    type: "string",
                                    example: "Chamalka pvt LTD",
                                },
                                taxID: {
                                    type: "string",
                                    example: "tax001",
                                },
                                businessAddress: {
                                    type: "string",
                                    example: "no32/1 welimada srilanka",
                                },
                                placeId: {
                                    type: "string",
                                    example: "place001",
                                },
                                longitude: {
                                    type: "number",
                                    format: "double",
                                    example: 6.123456789
                                },
                                latitude: {
                                    type: "number",
                                    format: "double",
                                    example: 6.123456789
                                },
                                logo: {
                                    type: ["string"],
                                    example: ["https://youtube.com"],
                                },
                                cover: {
                                    type: ["string"],
                                    example: ["https://youtube.com"],
                                },
                                gallery: {
                                    type: ["string"],
                                    example: ["https://youtube.com", "https://yt.com"],
                                },
                                link: {
                                    type: "string",
                                    example: "https://youtube.com",
                                },
                                expirience: {
                                    type: "Integer",
                                    example: 3
                                },
                                category: {
                                    type: "string",
                                    example: "entertainment, funny",
                                },
                                description: {
                                    type: "string",
                                    example: "stand up comedy show",
                                },
                            },
                        },
                    },
                },
            },
            responses: {},
        },
    },
    "/servicepro/admin/password":{
            patch: {
            summary: "Update admin password",
            description:
                "Update admin password",
            tags: ["Service Provider"],
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
                                oldPassword: {
                                    type: "string",
                                    example: "#taskerPassword99",
                                },
                                newPassword: {
                                    type: "string",
                                    example: "#taskerPassword99",
                                },
                            },
                        },
                    },
                },
            },
            responses: {},
        },
    },
    "/servicepro/profile/service-pro":{
        get:{
            summary: "Get Service Provider Profile",
            description:
                "Get the profile of a Service Provider",
            tags: ["Service Provider"],
            security: [
                {
                BearerAuth: []
                }
            ],
            responses: {}
        }
    },
    "/servicepro/profile/service-pro/{userId}": {
        get: {
            summary: "Fetch service pro by ID",
            description:
                "Fetch a service provider profile by ID",
            tags: ["Service Provider"],
            security: [
                {
                    BearerAuth: []
                }
            ],
            parameters:[
                {
                    name: "userId",
                    in: "path",
                    required: true,
                    schema: {
                        type: "string"
                    },
                    description: "service pro object id"
                },
            ],
            responses: {},
        },
    },
    "/servicepro/delete/{serviceProviderId}": {
        delete: {
            summary: "Delete specific service provider by ID (Admin only)",
            description: "Soft delete a specific service provider by their service provider ID. Sets isDeleted flag to true instead of permanently removing the record. Only accessible by admin users.",
            tags: ["Service Provider"],
            parameters: [
                {
                    name: "serviceProviderId",
                    in: "path",
                    required: true,
                    schema: {
                        type: "string",
                        example: "60d21b4667d0d8992e610c85",
                    },
                    description: "Service Provider ID - must be a valid MongoDB ObjectId",
                },
            ],
            security: [{ BearerAuth: [] }],
            requestBody: {
                required: false,
                content: {},
            },
            responses: {},
        }
    },

    //NOTE: from jumnaconnect ===========================>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

    // "/user/signup/tasker/verify/bank": { 
    //     post: {
    //         summary: "Validate the tasker bank information",
    //         description:
    //             "Validate the tasker bank information",
    //         tags: ["User"],
    //         security: [
    //             {
    //                 BearerAuth: []
    //             }
    //         ],
    //         requestBody: {
    //             required: true,
    //             content: {
    //                 "application/json": {
    //                     schema: {
    //                         type: "object",
    //                         properties: {
    //                             bankCode: {
    //                                 type: "string",
    //                                 example: "040100",
    //                             },
    //                             accNumber: {
    //                                 type: "string",
    //                                 example: "1361010049405",
    //                             },
    //                         },
    //                     },
    //                 },
    //             },
    //         },
    //         responses: {},
    //     },
    // },
    // "/user/signup/tasker/verify/mobile-money": { 
    //     post: {
    //         summary: "Validate the tasker mobile money information",
    //         description:
    //             "Validate the tasker mobile money information",
    //         tags: ["User"],
    //         security: [
    //             {
    //                 BearerAuth: []
    //             }
    //         ],
    //         requestBody: {
    //             required: true,
    //             content: {
    //                 "application/json": {
    //                     schema: {
    //                         type: "object",
    //                         properties: {
    //                             phone: {
    //                                 type: "string",
    //                                 example: "0551234987",
    //                             },
    //                             provider: {
    //                                 type: "string",
    //                                 example: "mtn",
    //                             },
    //                             email: {
    //                                 type: "string",
    //                                 example: "chamalkaauth@freesourcecodes.com",
    //                             },
    //                         },
    //                     },
    //                 },
    //             },
    //         },
    //         responses: {},
    //     },
    // },
    // "/user/signup/tasker": { // documentation for user/signup/tasker - Signup to the systema as a tasker
    //     post: {
    //         summary: "Signup as Tasker",
    //         description:
    //             "Signup a user/visitor to the system as a tasker",
    //         tags: ["User"],
    //         security: [
    //             {
    //                 BearerAuth: []
    //             }
    //         ],
    //         requestBody: {
    //             required: true,
    //             content: {
    //                 "application/json": {
    //                     schema: {
    //                         type: "object",
    //                         properties: {
    //                             firstName: {
    //                                 type: "string",
    //                                 example: "Chamalka",
    //                             },
    //                             lastName: {
    //                                 type: "string",
    //                                 example: "Marasinghe",
    //                             },
    //                             phoneNumber: {
    //                                 type: "string",
    //                                 example: "0331232123",
    //                             },
    //                             email: {
    //                                 type: "string",
    //                                 example: "chamalkaauth@freesourcecodes.com",
    //                             },
    //                             password: {
    //                                 type: "string",
    //                                 example: "#taskerPassword99",
    //                             },
    //                             profilePicture: {
    //                                 type: "string",
    //                                 example: "https://youtube.com",
    //                             },
    //                             aboutMe: {
    //                                 type: "string",
    //                                 example: "I am a professional tasker",
    //                             },
    //                             idNumber: {
    //                                 type: "string",
    //                                 example: "1234567890V",
    //                             },
    //                             idNumber: {
    //                                 type: "string",
    //                                 example: "1244567890V",
    //                             },
    //                             idImages: {
    //                                 type: ["string"],
    //                                 example: ["https://youtube.com", "https://youtube.com"],
    //                             },
    //                             proofAddress: {
    //                                 type: ["string"],
    //                                 example: ["https://youtube.com"],
    //                             },
    //                             professionalDetails: {
    //                                 type: [
    //                                     {
    //                                         categoryName: "string",
    //                                         skills: [
    //                                             {
    //                                                 skillName: "string",
    //                                                 description: "string"
    //                                             }
    //                                         ]
    //                                     }
    //                                 ],
    //                                 example: [
    //                                     {
    //                                         categoryName: "Home Service",
    //                                         skills: [
    //                                             {
    //                                                 skillName: "Appliance Installation and Repairs",
    //                                                 description: "Proficiency in installations and repairs"
    //                                             },
    //                                             {
    //                                                 skillName: "Pest Control Assistance",
    //                                                 description: "Proficiency in pest control assistance"
    //                                             }
    //                                         ]
    //                                     }
    //                                 ]
                                
    //                             },
    //                             servingAreas: {
    //                                 type: [
    //                                     {
    //                                         cityName: "string",
    //                                         subcities: ["string"]
    //                                     }
    //                                 ],
    //                                 example: [
    //                                     {
    //                                         cityName: "Tamale",
    //                                         subcities: ["Sagnarigu", "Savelugu"]
    //                                     }
    //                                 ]
                                
    //                             },
    //                             paymentType:{
    //                                 type: "string",
    //                                 example: paymentTypes.BANK
    //                             },
    //                             mobileMoneyProvider: {
    //                                 type: "string",
    //                                 example: "MTN Mobile Money (MTN MoMo)_mtn",
    //                             },
    //                             mobileNumber: {
    //                                 type: "string",
    //                                 example: "0551234987",
    //                             },
    //                             mobileMoneyAccHolderFullName: {
    //                                 type: "string",
    //                                 example: "Steve Smith",
    //                             },

    //                             bankName: {
    //                                 type: "string",
    //                                 example: "GCB Bank Limited_040100",
    //                             },
    //                             bankAccHolderFullName: {
    //                                 type: "string",
    //                                 example: "KEVIN MANU AGGREY",
    //                             },
    //                             accNumber: {
    //                                 type: "string",
    //                                 example: "1361010049405",
    //                             },
    //                             branchName: {
    //                                 type: "string",
    //                                 example: "Kissieman",
    //                             },
    //                         },
    //                     },
    //                 },
    //             },
    //         },
    //         responses: {},
    //     },
    // },
    // "/user/verify/tasker/{userId}": { // documentation for /user/verify/tasker/:userId - verify tasker profile
    //     patch: {
    //         summary: "Verify Tasker Profile",
    //         description:
    //             "Verification of the information of a tasker profile",
    //         tags: ["User"],
    //         security: [
    //             {
    //                 BearerAuth: []
    //             }
    //         ],
    //         parameters: [
    //             {
    //                 name: "userId",
    //                 in: "path",
    //                 required: true,
    //                 schema: {
    //                     type: "string"
    //                 },
    //                 description: "user id"
    //             },
    //         ],
    //         requestBody: {
    //             required: false,
    //             content: {},
    //         },
    //         responses: {},
    //     },
    // },
    // "/user/decline/tasker/{userId}": { // documentation for /user/decline/tasker/:userId - decline tasker profile
    //     patch: {
    //         summary: "Decline Tasker Profile",
    //         description:
    //             "Decline request of the information of a tasker profile",
    //         tags: ["User"],
    //         security: [
    //             {
    //                 BearerAuth: []
    //             }
    //         ],
    //         parameters: [
    //             {
    //                 name: "userId",
    //                 in: "path",
    //                 required: true,
    //                 schema: {
    //                     type: "string"
    //                 },
    //                 description: "user id"
    //             },
    //         ],
    //         requestBody: {
    //             required: false,
    //             content: {},
    //         },
    //         responses: {},
    //     },
    // },
    // "/user/suspend/tasker/{userId}": { // documentation for /user/suspend/tasker/:userId - suspend tasker profile
    //     patch: {
    //         summary: "Suspend Tasker Profile",
    //         description:
    //             "Suspend tasker profile",
    //         tags: ["User"],
    //         security: [
    //             {
    //                 BearerAuth: []
    //             }
    //         ],
    //         parameters: [
    //             {
    //                 name: "userId",
    //                 in: "path",
    //                 required: true,
    //                 schema: {
    //                     type: "string"
    //                 },
    //                 description: "user id"
    //             },
    //         ],
    //         requestBody: {
    //             required: false,
    //             content: {},
    //         },
    //         responses: {},
    //     },
    // },
    // "/user/re-active/tasker/{userId}": { // documentation for /user/re-active/tasker/:userId - re active suspended tasker profile
    //     patch: {
    //         summary: "Re-active Suspended Tasker Profile",
    //         description:
    //             "Re-active Suspended tasker profile",
    //         tags: ["User"],
    //         security: [
    //             {
    //                 BearerAuth: []
    //             }
    //         ],
    //         parameters: [
    //             {
    //                 name: "userId",
    //                 in: "path",
    //                 required: true,
    //                 schema: {
    //                     type: "string"
    //                 },
    //                 description: "user id"
    //             },
    //         ],
    //         requestBody: {
    //             required: false,
    //             content: {},
    //         },
    //         responses: {},
    //     },
    // },
    // "/user/level/tasker/{userId}": { 
    //     patch: {
    //         summary: "Update the tasker level",
    //         description:
    //             "Update the tasker level",
    //         tags: ["User"],
    //         security: [
    //             {
    //                 BearerAuth: []
    //             }
    //         ],
    //         parameters: [
    //             {
    //                 name: "userId",
    //                 in: "path",
    //                 required: true,
    //                 schema: {
    //                     type: "string"
    //                 },
    //                 description: "user id"
    //             },
    //         ],
    //         requestBody: {
    //             required: false,
    //             content: {
    //                 "application/json": {
    //                     schema: {
    //                         type: "object",
    //                         properties: {
    //                             level: {
    //                                 type: "Integer",
    //                                 example: 6,
    //                             },
    //                         },
    //                     },
    //                 },
    //             },
    //         },
    //         responses: {},
    //     },
    // },
    // "/user/tasker/{userId}": { 
    //     delete: {
    //         summary: "Delete the tasker priviledges",
    //         description: "Deleting the tasker priviledges.",
    //         tags: ["User"],
    //         security: [
    //             {
    //                 BearerAuth: []
    //             }
    //         ],
    //         parameters: [
    //             {
    //                 name: "userId",
    //                 in: "path",
    //                 required: true,
    //                 schema: {
    //                     type: "string"
    //                 },
    //                 description: "user id"
    //             },
    //         ],
    //         requestBody: {
    //             required: false,
    //             content: {},
    //         },
    //         responses: {},
    //     },
    // },
    // "/user/nonTasker/{userId}": { 
    //     delete: {
    //         summary: "Delete the non tasker",
    //         description: "Deleting the non tasker",
    //         tags: ["User"],
    //         security: [
    //             {
    //                 BearerAuth: []
    //             }
    //         ],
    //         parameters: [
    //             {
    //                 name: "userId",
    //                 in: "path",
    //                 required: true,
    //                 schema: {
    //                     type: "string"
    //                 },
    //                 description: "user id"
    //             },
    //         ],
    //         requestBody: {
    //             required: false,
    //             content: {},
    //         },
    //         responses: {},
    //     },
    // },
    // "/user/tasker/self": { // documentation for user/tasker - Fetching, filtering, quering tasker profiles
    //     get: {
    //         summary: "Fetch tasker self profiles",
    //         description: "Fetch tasker self profiles",
    //         tags: ["User"],
    //         security: [
    //             {
    //             BearerAuth: []
    //             }
    //         ],
    //         requestBody: {
    //             required: false,
    //             content: {},
    //         },
    //         responses: {},
    //     },
    // },
    // "/user/tasker": { // documentation for user/tasker - Fetching, filtering, quering tasker profiles
    //     get: {
    //         summary: "Fetch tasker profiles",
    //         description: "Fetch tasker profiles according to different criterias like sorting, searching, filtering and quering",
    //         tags: ["User"],
    //         parameters: [
    //             {
    //                 name: "offset",
    //                 in: "query",
    //                 required: false,
    //                 schema: {
    //                     type: "integer",
    //                 },
    //                 description: "offset value"
    //             },
    //             {
    //                 name: "limit",
    //                 in: "query",
    //                 required: false,
    //                 schema: {
    //                     type: "integer",
    //                 },
    //                 description: "limit value"
    //             },
    //             {
    //                 name: "userName",
    //                 in: "query",
    //                 required: false,
    //                 schema: {
    //                     type: "string"
    //                 },
    //                 description: "user name"
    //             },
    //             {
    //                 name: "city",
    //                 in: "query",
    //                 required: false,
    //                 schema: {
    //                     type: "string"
    //                 },
    //                 description: "city"
    //             },
    //             {
    //                 name: "subcity",
    //                 in: "query",
    //                 required: false,
    //                 schema: {
    //                     type: "string"
    //                 },
    //                 description: "subcity"
    //             },
    //             {
    //                 name: "category",
    //                 in: "query",
    //                 required: false,
    //                 schema: {
    //                     type: "string"
    //                 },
    //                 description: "category"
    //             },
    //             {
    //                 name: "skill",
    //                 in: "query",
    //                 required: false,
    //                 schema: {
    //                     type: "string"
    //                 },
    //                 description: "skill"
    //             },
    //             {
    //                 name: "userId",
    //                 in: "query",
    //                 required: false,
    //                 schema: {
    //                     type: "string"
    //                 },
    //                 description: "user id"
    //             },
    //             {
    //                 name: "withReviewedOrdersCount",
    //                 in: "query",
    //                 required: false,
    //                 schema: {
    //                     type: "boolean",
    //                     example: true
    //                 },
    //                 description: "with Reviewed Orders Count"
    //             },
    //             {
    //                 name: "withTotalOrdersCount",
    //                 in: "query",
    //                 required: false,
    //                 schema: {
    //                     type: "boolean",
    //                     example: true
    //                 },
    //                 description: "with Total Orders Count"
    //             },
    //             {
    //                 name: "isSuspended",
    //                 in: "query",
    //                 required: false,
    //                 schema: {
    //                     type: "boolean",
    //                     example: false
    //                 },
    //                 description: "filtering Suspended users"
    //             },
    //         ],
    //         security: [
    //             {
    //             BearerAuth: []
    //             }
    //         ],
    //         requestBody: {
    //             required: false,
    //             content: {},
    //         },
    //         responses: {},
    //     },
    // },
    // "/user/nonTasker": { 
    //     get: {
    //         summary: "Fetch non tasker profiles - Only client users",
    //         description: "Fetch non tasker profiles - Only client users",
    //         tags: ["User"],
    //         parameters: [
    //             {
    //                 name: "userId",
    //                 in: "query",
    //                 required: false,
    //                 schema: {
    //                     type: "string"
    //                 },
    //                 description: "user id"
    //             },
    //             {
    //                 name: "offset",
    //                 in: "query",
    //                 required: false,
    //                 schema: {
    //                     type: "integer",
    //                 },
    //                 description: "offset value"
    //             },
    //             {
    //                 name: "limit",
    //                 in: "query",
    //                 required: false,
    //                 schema: {
    //                     type: "integer",
    //                 },
    //                 description: "limit value"
    //             },
    //             {
    //                 name: "userName",
    //                 in: "query",
    //                 required: false,
    //                 schema: {
    //                     type: "string"
    //                 },
    //                 description: "user name: search by name of the user"
    //             },
    //             {
    //                 name: "date",
    //                 in: "query",
    //                 required: false,
    //                 schema: {
    //                     type: "string"
    //                 },
    //                 description: "date: search by created date"
    //             },
    //             {
    //                 name: "startingDate",
    //                 in: "query",
    //                 required: false,
    //                 schema: {
    //                     type: "string"
    //                 },
    //                 description: "date: search from starting date"
    //             },
    //             {
    //                 name: "endingDate",
    //                 in: "query",
    //                 required: false,
    //                 schema: {
    //                     type: "string"
    //                 },
    //                 description: "date: search till ending date"
    //             },
    //             {
    //                 name: "withTotalJobpostCount",
    //                 in: "query",
    //                 required: false,
    //                 schema: {
    //                     type: "boolean",
    //                     example: true
    //                 },
    //                 description: "with Total Jobpost Count"
    //             },

    //         ],
    //         security: [
    //             {
    //                 BearerAuth: []
    //             }
    //         ],
    //         requestBody: {
    //             required: false,
    //             content: {},
    //         },
    //         responses: {},
    //     },
    // },
    // "/user/tasker-requests": { 
    //     get: {
    //         summary: "Fetch tasker requests",
    //         description: "Fetch tasker requests",
    //         tags: ["User"],
    //         parameters: [
    //             {
    //                 name: "userId",
    //                 in: "query",
    //                 required: false,
    //                 schema: {
    //                     type: "string"
    //                 },
    //                 description: "user id"
    //             },
    //             {
    //                 name: "offset",
    //                 in: "query",
    //                 required: false,
    //                 schema: {
    //                     type: "integer",
    //                 },
    //                 description: "offset value"
    //             },
    //             {
    //                 name: "limit",
    //                 in: "query",
    //                 required: false,
    //                 schema: {
    //                     type: "integer",
    //                 },
    //                 description: "limit value"
    //             },
    //             {
    //                 name: "userName",
    //                 in: "query",
    //                 required: false,
    //                 schema: {
    //                     type: "string"
    //                 },
    //                 description: "user name: search by name of the user"
    //             },
    //             {
    //                 name: "date",
    //                 in: "query",
    //                 required: false,
    //                 schema: {
    //                     type: "string"
    //                 },
    //                 description: "date: search by created date"
    //             },
    //             {
    //                 name: "startingDate",
    //                 in: "query",
    //                 required: false,
    //                 schema: {
    //                     type: "string"
    //                 },
    //                 description: "date: search from starting date"
    //             },
    //             {
    //                 name: "endingDate",
    //                 in: "query",
    //                 required: false,
    //                 schema: {
    //                     type: "string"
    //                 },
    //                 description: "date: search till ending date"
    //             },
    //         ],
    //         security: [
    //             {
    //                 BearerAuth: []
    //             }
    //         ],
    //         requestBody: {
    //             required: false,
    //             content: {},
    //         },
    //         responses: {},
    //     },
    // },
    // "/user/inquiry": {
    //     // Create a new inquiry
    //     post: {
    //     summary: "Create an Inquiry",
    //     description: "Submit an new inquiry with relevant details.",
    //     tags: ["User"],
    //     security: [
    //         {
    //         BearerAuth: []
    //         }
    //     ],
    //     requestBody: {
    //         required: true,
    //         content: {
    //         "application/json": {
    //             schema: {
    //             type: "object",
    //             properties: {
    //                 firstName: {
    //                     type: "string",
    //                     example: "Chamalka",
    //                 },
    //                 lastName: {
    //                     type: "string",
    //                     example: "Marasinghe",
    //                 },
    //                 role: {
    //                     type: "string",
    //                     example: rolesForInquiry.USER,
    //                 },
    //                 email: {
    //                     type: "string",
    //                     example: "chamalkaauth@freesourcecodes.com",
    //                 },
    //                 subject: {
    //                     type: "string",
    //                     example: "Issue with my account",
    //                 },
    //                 message: {
    //                     type: "string",
    //                     example: "I'm unable to reset my password.",
    //                 },
    //             },
    //             },
    //         },
    //         },
    //     },
    //     responses: {
    //         201: {
    //         description: "Inquiry created successfully.",
    //         },
    //         400: {
    //         description: "Bad Request - Missing required fields.",
    //         },
    //     },
    //     },
    // },
    // "/user/profile": { // documentation for user/profile/:userId - Update user profile
    //     put: {
    //         summary: "Update User Profile",
    //         description:
    //             "Update the profile of a user",
    //         tags: ["User"],
    //         security: [
    //             {
    //             BearerAuth: []
    //             }
    //         ],
    //         requestBody: {
    //             required: true,
    //             content: {
    //                 "application/json": {
    //                     schema: {
    //                         type: "object",
    //                         properties: {
    //                             firstName: {
    //                                 type: "string",
    //                                 example: "Chamalka",
    //                             },
    //                             lastName: {
    //                                 type: "string",
    //                                 example: "Marasinghe",
    //                             },
    //                             phoneNumber: {
    //                                 type: "string",
    //                                 example: "0331232123",
    //                             },
    //                             profilePicture: {
    //                                 type: "string",
    //                                 example: "https://youtub.com",
    //                             },
    //                             email: {
    //                                 type: "string",
    //                                 example: "chamalkaauth@freesourcecodes.com",	
    //                             },
    //                             jobTitle: {
    //                                 type: "string",
    //                                 example: "Trainee SE",
    //                             },
    //                             location: {
    //                                 type: "string",
    //                                 example: "Accra",
    //                             },
    //                         }
    //                     }
    //                 }
    //             }
    //         },
    //         responses: {}
    //     },
    // },
    // "/user/admin/profile": {
    //     put: {
    //         summary: "Update Admin Profile",
    //         description:
    //             "Update the profile of Admin",
    //         tags: ["User"],
    //         security: [
    //             {
    //                 BearerAuth: []
    //             }
    //         ],
    //         requestBody: {
    //             required: true,
    //             content: {
    //                 "application/json": {
    //                     schema: {
    //                         type: "object",
    //                         properties: {
    //                             firstName: {
    //                                 type: "string",
    //                                 example: "Super",
    //                             },
    //                             lastName: {
    //                                 type: "string",
    //                                 example: "Admin",
    //                             },
    //                             phoneNumber: {
    //                                 type: "string",
    //                                 example: "0331232123",
    //                             },
    //                             profilePicture: {
    //                                 type: "string",
    //                                 example: "https://youtub.com",
    //                             },
    //                             email: {
    //                                 type: "string",
    //                                 example: "admintasker@edny.net",	
    //                             }  
    //                         }
    //                     }
    //                 }
    //             }
    //         },
    //         responses: {}
    //     },
    // },
    // "/user/admin/password": {
    //     patch: {
    //         summary: "Update admin password",
    //         description:
    //             "Update admin password",
    //         tags: ["User"],
    //         security: [
    //             {
    //                 BearerAuth: []
    //             }
    //         ],
    //         requestBody: {
    //             required: true,
    //             content: {
    //                 "application/json": {
    //                     schema: {
    //                         type: "object",
    //                         properties: {
    //                             oldPassword: {
    //                                 type: "string",
    //                                 example: "#taskerPassword99",
    //                             },
    //                             newPassword: {
    //                                 type: "string",
    //                                 example: "#taskerPassword99",
    //                             },
    //                         },
    //                     },
    //                 },
    //             },
    //         },
    //         responses: {},
    //     },
    // },
};