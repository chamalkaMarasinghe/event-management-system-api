module.exports = {
  "/jobpost": {
    post: {
      summary: "Create a new job post",
      description: "Creates a job post with title, date, time, description, category, location, and images.",
      tags: ["Job Post"],
      security: [{ BearerAuth: [] }], // Requires JWT token
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["title", "date", "time", "description", "category", "location"],
              properties: {
                title: {
                  type: "string",
                  example: "Plumbing Repair and Electrical Checkup"
                },
                date: {
                  type: "string",
                  format: "date",
                  example: "2025-06-15"
                },
                time: {
                  type: "string",
                  example: "14:30"
                },
                description: {
                  type: "string",
                  example: "Fixing plumbing issues and electrical maintenance."
                },
                category: {
                  type: "object",
                  properties: {
                    categoryItem: {
                      type: "string",
                      example: "General Handyman Services"
                    },
                    skills: {
                      type: "array",
                      items: { type: "string" },
                      example: ["Door Repair", "Window Repair"]
                    }
                  }
                },
                location: {
                  type: "object",
                  properties: {
                    city: {
                      type: "string",
                      example: "Kumasi"
                    },
                    subCities: {
                      type: "array",
                      items: { type: "string" },
                      example: ["Ejisu", "Suame"]
                    }
                  }
                },
                images: {
                  type: "array",
                  items: { type: "string" },
                  example: ["https://example.com/image1.jpg", "https://example.com/image2.png"]
                }
              }
            }
          }
        }
      },
      responses: {}
    },
    get: {
      summary: "Get all job posts",
      description: "Fetches job posts with pagination parameters limit and offset.",
      tags: ["Job Post"],
      security: [{ BearerAuth: [] }],
      parameters: [
        {
          name: "limit",
          in: "query",
          required: false,
          description: "Number of job posts to fetch",
          schema: {
            type: "integer"
          }
        },
        {
          name: "offset",
          in: "query",
          required: false,
          description: "Pagination offset",
          schema: {
            type: "integer"
          }
        },
        {
          name: "city",
          in: "query",
          required: false,
          schema: {
              type: "string"
          },
          description: "city"
        },
        {
          name: "subcity",
          in: "query",
          required: false,
          schema: {
              type: "string"
          },
          description: "subcity"
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
          name: "skill",
          in: "query",
          required: false,
          schema: {
              type: "string"
          },
          description: "skill"
        },
      ],
      responses: {
        "200": {
          description: "jobPosts Fetched Successfully."
        }
      }
    },
  },
  "/jobpost/{jobPostId}": {
    get: {
      summary: "Get a single job post",
      description: "Fetches details of a specific job post using the provided jobPostId.",
      tags: ["Job Post"],
      security: [{ BearerAuth: [] }],
      parameters: [
        {
          name: "jobPostId",
          in: "path",
          required: true,
          description: "The jobPost ID of the job post to fetch",
          schema: { type: "string" }
        }
      ],
      responses: {
        "200": {
          description: "Job post fetched successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: { type: "integer", example: 200 },
                  message: { type: "string", example: "Job post fetched successfully" },
                  data: { type: "object" }
                }
              }
            }
          }
        }
      }
    },
    put: {
      summary: "Edit a job post",
      description: "Updates an existing job post based on the provided jobPostId.",
      tags: ["Job Post"],
      security: [{ BearerAuth: [] }], // Requires JWT token
      parameters: [
        {
          name: "jobPostId",
          in: "path",
          required: true,
          description: "The ID of the job post to update",
          schema: {
            type: "string"
          }
        }
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["title", "date", "time", "description", "category", "location"],
              properties: {
                title: {
                  type: "string",
                  example: "Ceiling Fan Installation and Leak Repair"
                },
                date: {
                  type: "string",
                  format: "date",
                  example: "2025-07-12"
                },
                time: {
                  type: "string",
                  example: "10:00"
                },
                description: {
                  type: "string",
                  example: "Installing ceiling fans and fixing plumbing leaks in the house II."
                },
                category: {
                  type: "object",
                  properties: {
                    categoryItem: {
                      type: "string",
                      example: "Electrical Services"
                    },
                    skills: {
                      type: "array",
                      items: { type: "string" },
                      example: ["Installing Ceiling Fans", "Installing Security Cameras"]
                    }
                  }
                },
                location: {
                  type: "object",
                  properties: {
                    city: {
                      type: "string",
                      example: "Kumasi"
                    },
                    subCities: {
                      type: "array",
                      items: { type: "string" },
                      example: ["Bantama", "Suame"]
                    }
                  }
                },
                images: {
                  type: "array",
                  items: { type: "string" },
                  example: ["https://example.com/ceilingfan.jpg", "https://example.com/leakrepair.png"]
                }
              }
            }
          }
        }
      },
      responses: {
        "200": {
          description: "Job post updated successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: {
                    type: "integer",
                    example: 200
                  },
                  message: {
                    type: "string",
                    example: "Job post updated successfully"
                  },
                  data: {
                    type: "object",
                    properties: {
                      _id: {
                        type: "string",
                        example: "67b04fa15596a01f9e02309a"
                      },
                      title: {
                        type: "string",
                        example: "Ceiling Fan Installation and Leak Repair"
                      },
                      date: {
                        type: "string",
                        format: "date-time",
                        example: "2025-07-12T00:00:00.000Z"
                      },
                      time: {
                        type: "string",
                        example: "10:00"
                      },
                      description: {
                        type: "string",
                        example: "Installing ceiling fans and fixing plumbing leaks in the house II."
                      },
                      category: {
                        type: "object",
                        properties: {
                          categoryItem: {
                            type: "string",
                            example: "Electrical Services"
                          },
                          skills: {
                            type: "array",
                            items: { type: "string" },
                            example: ["Installing Ceiling Fans", "Installing Security Cameras"]
                          }
                        }
                      },
                      location: {
                        type: "object",
                        properties: {
                          city: {
                            type: "string",
                            example: "Kumasi"
                          },
                          subCities: {
                            type: "array",
                            items: { type: "string" },
                            example: ["Bantama", "Suame"]
                          }
                        }
                      },
                      images: {
                        type: "array",
                        items: { type: "string" },
                        example: ["https://example.com/ceilingfan.jpg", "https://example.com/leakrepair.png"]
                      },
                      createdBy: {
                        type: "string",
                        example: "67b04f695596a01f9e023094"
                      },
                      status: {
                        type: "string",
                        example: "ACTIVE"
                      },
                      isDeleted: {
                        type: "boolean",
                        example: false
                      },
                      createdAt: {
                        type: "string",
                        format: "date-time",
                        example: "2025-02-15T08:26:09.943Z"
                      },
                      updatedAt: {
                        type: "string",
                        format: "date-time",
                        example: "2025-02-17T10:17:18.057Z"
                      },
                      __v: {
                        type: "integer",
                        example: 1
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    delete: {
      summary: "Delete a job post",
      description: "Deletes a job post by its ID.",
      tags: ["Job Post"],
      security: [{ BearerAuth: [] }], // Requires JWT token
      parameters: [
        {
          name: "jobPostId",
          in: "path",
          required: true,
          description: "The ID of the job post to delete",
          schema: {
            type: "string",
            example: "60d5f9b6d1e4f8a3f8b7f3c1", // Example job post ID
          },
        },
      ],
      responses: {},
    },
  },
  "/jobpost/{jobPostId}/with-matchings" : {
    get: {
      summary: "Get a single job post with other matching result",
      description: "Fetches details of a specific job post using the provided jobPostId along with the other related job posts.",
      tags: ["Job Post"],
      security: [{ BearerAuth: [] }],
      parameters: [
        {
          name: "jobPostId",
          in: "path",
          required: true,
          description: "The jobPost ID of the job post to fetch",
          schema: { type: "string" }
        },
        {
          name: "city",
          in: "query",
          required: false,
          schema: {
              type: "string"
          },
          description: "city"
        },
        {
          name: "subcity",
          in: "query",
          required: false,
          schema: {
              type: "string"
          },
          description: "subcity"
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
          name: "skill",
          in: "query",
          required: false,
          schema: {
              type: "string"
          },
          description: "skill"
        },
      ],
      responses: {
        "200": {
          description: "Job post fetched successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: { type: "integer", example: 200 },
                  message: { type: "string", example: "Job post fetched successfully" },
                  data: { type: "object" }
                }
              }
            }
          }
        }
      }
    },
  },
  "/jobpost/user": {
    get: {
      summary: "Get all user job posts",
      description: "Fetches job posts associated to specific user with pagination parameters limit and offset.",
      tags: ["Job Post"],
      security: [{ BearerAuth: [] }],
      parameters: [
        {
          name: "limit",
          in: "query",
          required: false,
          description: "Number of job posts to fetch",
          schema: {
            type: "integer"
          }
        },
        {
          name: "offset",
          in: "query",
          required: false,
          description: "Pagination offset",
          schema: {
            type: "integer"
          }
        }
      ],
      responses: {
        "200": {
          description: "jobPosts Fetched Successfully."
        }
      }
    },
  },
  "/jobpost/user/{jobPostId}": {
    get: {
      summary: "Get a single user job post",
      description: "Fetches details of a specific job post associated to a specific user using the provided jobPostId.",
      tags: ["Job Post"],
      security: [{ BearerAuth: [] }],
      parameters: [
        {
          name: "jobPostId",
          in: "path",
          required: true,
          description: "The jobPost ID of the job post to fetch",
          schema: { type: "string" }
        }
      ],
      responses: {
        "200": {
          description: "Job post fetched successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: { type: "integer", example: 200 },
                  message: { type: "string", example: "Job post fetched successfully" },
                  data: { type: "object" }
                }
              }
            }
          }
        }
      }
    },
  },
}