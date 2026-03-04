module.exports = {
  "/order": {
    get: {
      summary: "Fetch all orders",
      description: "Fetch all available orders",
      tags: ["Order"],
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
          name: "searchTerm",
          in: "query",
          required: false,
          schema: {
            type: "string"
          },
          description: "search term: search by custom order id"
        },
        {
          name: "status",
          in: "query",
          required: false,
          schema: {
            type: "string"
          },
          description: "search order by status"
        },
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
          name: "orderProgressArrayInclude",
          in: "query",
          required: false,
          schema: {
            type: "string",
            example: "COMPLETED,IN_REVISION"
          },
          description: "search order by including status"
        },
        {
          name: "orderProgressArrayExclude",
          in: "query",
          required: false,
          schema: {
            type: "string",
            example: "COMPLETED,IN_REVISION"
          },
          description: "search order by excluding status"
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
          name: "date",
          in: "query",
          required: false,
          schema: {
            type: "string"
          },
          description: "date: search by created date"
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
          name: "dateFilteringType",
          in: "query",
          required: false,
          schema: {
            type: "string",
            example: "ISSUE_RAISED"
          },
          description: "filter by date type"
        },
        {
          name: "isReviews",
          in: "query",
          required: false,
          schema: {
            type: "boolean",
            example: false
          },
          description: "search reviewed orders"
        },
      ],
      security: [{ BearerAuth: [] }], // Requires JWT token
      requestBody: {
        required: false,
        content: {}
      },
      responses: {}
    }
  },
  "/order/category-report": {
    get: {
      summary: "Fetch category report",
      description: "Fetch category report",
      tags: ["Order"],
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
      ],
      security: [{ BearerAuth: [] }], // Requires JWT token
      requestBody: {
        required: false,
        content: {}
      },
      responses: {}
    }
  },
  "/order/dashboard-report": {
    get: {
      summary: "Fetch dashboard report",
      description: "Fetch dashboard report",
      tags: ["Order"],
      parameters: [
      ],
      security: [{ BearerAuth: [] }], // Requires JWT token
      requestBody: {
        required: false,
        content: {}
      },
      responses: {}
    }
  },
  "/order/payment-history": {
    get: {
      summary: "Fetch Payment History of Orders",
      description: "Fetch Payment History of Orders",
      tags: ["Order"],
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
      ],
      security: [{ BearerAuth: [] }], // Requires JWT token
      requestBody: {
        required: false,
        content: {}
      },
      responses: {}
    }
  },
  "/order/{orderId}": {
    get: {
      summary: "Fetch order by ID",
      description: "Fetch order by ID",
      tags: ["Order"],
      parameters: [
        {
          name: "orderId",
          in: "path",
          required: true,
          schema: {
              type: "string"
            },
          description: "order id"
        },
      ],
      security: [{ BearerAuth: [] }], // Requires JWT token
      requestBody: {
        required: false,
        content: {}
      },
      responses: {}
    }
  },
  "/order/user": {
    get: {
      summary: "Fetch all user/tasker orders",
      description: "Fetch all available orders associated to given user/tasker",
      tags: ["Order"],
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
          name: "searchTerm",
          in: "query",
          required: false,
          schema: {
            type: "string"
          },
          description: "search term: search by custom order id"
        },
        {
          name: "status",
          in: "query",
          required: false,
          schema: {
            type: "string"
          },
          description: "search order by status"
        },
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
          name: "orderProgressArrayInclude",
          in: "query",
          required: false,
          schema: {
            type: "string",
            example: "COMPLETED,IN_REVISION"
          },
          description: "search order by including status"
        },
        {
          name: "orderProgressArrayExclude",
          in: "query",
          required: false,
          schema: {
            type: "string",
            example: "COMPLETED,IN_REVISION"
          },
          description: "search order by excluding status"
        },
        {
          name: "date",
          in: "query",
          required: false,
          schema: {
            type: "string"
          },
          description: "date: search by created date"
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
    ],
      security: [{ BearerAuth: [] }], // Requires JWT token
      requestBody: {
        required: false,
        content: {}
      },
      responses: {}
    }
  },
  "/order/user/statics": {
    get: {
      summary: "Fetch user statics",
      description: "Fetch user statics",
      tags: ["Order"],
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
          name: "status",
          in: "query",
          required: false,
          schema: {
            type: "string"
          },
          description: "search order by status"
        },
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
          name: "date",
          in: "query",
          required: false,
          schema: {
            type: "string"
          },
          description: "date: search by created date"
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
    ],
      security: [{ BearerAuth: [] }], // Requires JWT token
      requestBody: {
        required: false,
        content: {}
      },
      responses: {}
    }
  },
  "/order/user/{orderId}": {
    get: {
      summary: "Fetch user/tasker order by ID",
      description: "Fetch user/tasker order by ID",
      tags: ["Order"],
      parameters: [
        {
          name: "orderId",
          in: "path",
          required: true,
          schema: {
              type: "string"
            },
          description: "order id"
        },
      ],
      security: [{ BearerAuth: [] }], // Requires JWT token
      requestBody: {
        required: false,
        content: {}
      },
      responses: {}
    }
  },
  "/order/deliver": {
    post: {
      summary: "Deliver the order",
      description: "Updates an order with delivery notes and final deliverable URLs.",
      tags: ["Order"],
      security: [{ BearerAuth: [] }], // Requires JWT token
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["deliveryNotes", "orderId"],
              properties: {
                orderId: {
                  type: "string",
                  example: "order id <Mongodb object id>",
                },
                deliveryNotes: {
                  type: "string",
                  example: "The project IO has been completed successfully. Please find the final deliverables attached."
                },
                additionalRequirements: {
                  type: "array",
                  items: { type: "string" },
                  example: ["https://example.com/final-report.png"]
                }
              }
            }
          }
        }
      },
      responses: {}
    }
  },
  "/order/request-revision": {
    post: {
      summary: "Request a Revision",
      description:
        "Allows a user to request a revision for an delivered order.",
      tags: ["Order"],
      security: [{ BearerAuth: [] }], // Requires JWT token
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["orderId", "revisionNote"],
              properties: {
                orderId: {
                  type: "string",
                  description:
                    "The ID of the order for which the revision is being requested.",
                  example: "603d2f8b9a0c1234567890ab",
                },
                revisionNote: {
                  type: "string",
                  description: "A note explaining the revision request.",
                  example:
                    "Please revise the format and update the references as discussed.",
                },
                documents: {
                  type: "array",
                  description:
                    "A list of document URLs related to the revision request.",
                  items: { type: "string" },
                  example: [
                    "https://example.com/document1.pdf",
                    "https://example.com/document2.pdf",
                  ],
                },
              },
            },
          },
        },
      },
      responses: {},
    },
  },
  "/order/complete": {
    post: {
      summary: "Complete an order",
      description:
        "Allows a user to complete an delivered order",
      tags: ["Order"],
      security: [{ BearerAuth: [] }], // Requires JWT token
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["orderId"],
              properties: {
                orderId: {
                  type: "string",
                  description:
                    "The ID of the order",
                  example: "603d2f8b9a0c1234567890ab",
                },
              },
            },
          },
        },
      },
      responses: {},
    },
  },
  "/order/issue": {
    post: {
      summary: "Submit an Issue",
      description:
        "Allows a tasker to submit a issue for an completed order",
      tags: ["Order"],
      security: [{ BearerAuth: [] }], // Requires JWT token
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["orderId", "complaintReason"],
              properties: {
                orderId: {
                  type: "string",
                  description:
                    "The ID of the order for which the complaint is being submitted.",
                  example: "67b6f89f9c7ca0ec97821243",
                },
                complaintReason: {
                  type: "string",
                  description: "The reason for the complaint.",
                  example:
                    "The delivered work did not meet the expectations and contains several errors.",
                },
              },
            },
          },
        },
      },
      responses: {},
    },
  },
  "/order/resolve-issue": {
    post: {
      summary: "Resolve an issue",
      description:
        "Resolving an issue by admin",
      tags: ["Order"],
      security: [{ BearerAuth: [] }], // Requires JWT token
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["orderId", "providedResolution", "resolveNotes"],
              properties: {
                orderId: {
                  type: "string",
                  description:
                    "The ID of the order",
                  example: "67b6f89f9c7ca0ec97821243",
                },
                providedResolution: {
                  type: "string",
                  description: "Provided resolution",
                  example: "Unprofessional behavior",
                },
                resolveNotes: {
                  type: "string",
                  description: "Provided resolution notes.",
                  example: "My Complaint resolving note",
                },
                resolutionReferenceDocuments: {
                  type: "array",
                  items: { type: "string" },
                  example: [
                    "https://example1.com/final-report.png", 
                    "https://example2.com/final-report.png", 
                    "https://example3.com/final-report.png", 
                    "https://example4.com/final-report.png", 
                    "https://example5.com/final-report.png", 
                    "https://example6.com/final-report.png"]
                }
              },
            },
          },
        },
      },
      responses: {},
    },
  },
  "/order/complaint": {
    post: {
      summary: "Submit an Complaint",
      description:
        "Allows a user to submit a complaint for an completed order",
      tags: ["Order"],
      security: [{ BearerAuth: [] }], // Requires JWT token
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["orderId", "complaintReason"],
              properties: {
                orderId: {
                  type: "string",
                  description:
                    "The ID of the order for which the complaint is being submitted.",
                  example: "67b6f89f9c7ca0ec97821243",
                },
                complaintReason: {
                  type: "string",
                  description: "The reason for the complaint.",
                  example: "Unprofessional behavior",
                },
                comments: {
                  type: "string",
                  description: "Comments for the complaint.",
                  example: "My Complaint comment",
                },
                documents: {
                  type: "array",
                  items: { type: "string" },
                  example: [
                    "https://example1.com/final-report.png", 
                    "https://example2.com/final-report.png", 
                    "https://example3.com/final-report.png", 
                    "https://example4.com/final-report.png", 
                    "https://example5.com/final-report.png", 
                    "https://example6.com/final-report.png"]
                }
              },
            },
          },
        },
      },
      responses: {},
    },
  },
  "/order/resolve-complaint": {
    post: {
      summary: "Resolve a Complaint",
      description:
        "Resolving a complaint by admin",
      tags: ["Order"],
      security: [{ BearerAuth: [] }], // Requires JWT token
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["orderId", "providedResolution", "resolveNotes"],
              properties: {
                orderId: {
                  type: "string",
                  description:
                    "The ID of the order.",
                  example: "67b6f89f9c7ca0ec97821243",
                },
                providedResolution: {
                  type: "string",
                  description: "Provided resolution",
                  example: "Unprofessional behavior",
                },
                resolveNotes: {
                  type: "string",
                  description: "Provided resolution notes.",
                  example: "My Complaint resolving note",
                },
                resolutionReferenceDocuments: {
                  type: "array",
                  items: { type: "string" },
                  example: [
                    "https://example1.com/final-report.png", 
                    "https://example2.com/final-report.png", 
                    "https://example3.com/final-report.png", 
                    "https://example4.com/final-report.png", 
                    "https://example5.com/final-report.png", 
                    "https://example6.com/final-report.png"]
                }
              },
            },
          },
        },
      },
      responses: {},
    },
  },
  "/order/review": {
    post: {
      summary: "Submit a Review for an Order",
      description:
        "Allows a user or tasker to submit a review for a completed order. Users can review taskers, and taskers can review users. Each user can submit only one review per order.",
      tags: ["Order"],
      security: [{ BearerAuth: [] }], // Requires JWT token
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["orderId", "rating"],
              properties: {
                orderId: {
                  type: "string",
                  description: "The ID of the order being reviewed.",
                  example: "67b5845a720cdb67d3c4ea5b"
                },
                rating: {
                  type: "integer",
                  description: "The rating given by the reviewer (1 to 5 stars).",
                  minimum: 1,
                  maximum: 5,
                  example: 5
                },
                feedback: {
                  type: "string",
                  description:
                    "Optional feedback about the order experience, up to 500 characters.",
                  maxLength: 500,
                  example: "This tasker review"
                }
              }
            }
          }
        }
      },
      responses: {}
    }
  }
}