const mongoose = require("mongoose");
const {  } = require("../constants/commonConstants");
const commonConstants = require("../constants/commonConstants");

// NOTE: get all events, client their booked events 
exports.getClientsPipeline = ({
    title = null,
    category = null,
    status = null,
    location = null,
    date = null,
    startingDate = null, 
    endingDate = null,
    isOrders = false,
    isComplaints = false,
    userId,
    serviceProviderId,
    limit = 0,
    skip = 0,
}) => {

    const filterStages = [];

    // NOTE: excluding the deleted entries
    filterStages.push(
        { 
            $match: { isDeleted: { $ne: true } } 
        }
    )

    // NOTE : filter users name  
    if(title){
        // NOTE: concating both user first name and last name -> then save within new temp field
        filterStages.push(
            {
                $addFields: {
                    fullName: { $concat: ["$firstName", " ", "$lastName"] },
                }
            }
        )

        // NOTE: Case-insensitive partial match
        filterStages.push(
            {
                $match: {
                    $or: [
                        {fullName: { $regex: title, $options: "i" } },
                    ]
                }
            }
        )
    }

    // Note: filtering users based on registered date
    if(startingDate){
        filterStages.push(
            {
                $match: {
                    $expr: {
                        $gte: [
                            { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                            startingDate
                        ]
                    }
                }
            }
        )
    }
    if(endingDate){
        filterStages.push(
            {
                $match: {
                    $expr: {
                        $lte: [
                            { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                            endingDate
                        ]
                    }
                }
            }
        );
    }

    const baseStage = [
        ...filterStages,
        {$project: {password: 0, wishList: 0}}
    ];

    // NOTE: Sort latest first
    baseStage.push({ $sort: { createdAt: -1 } });

    // NOTE: Pagination
    if (limit && limit > 0) {
        baseStage.push({
            $facet: {
                paginatedData: [{ $skip: skip }, { $limit: limit }],
                metaData: [{ $count: "totalCount" }]
            }
        });
    }

    return baseStage;
};

// NOTE: from juma connect ===========================================================

exports.getTaskersStages_z = ({
    user = null,
    type = commonConstants.roles.TASKER,
    excludingType = null,
    city = null,
    subcity = null,
    category = null,
    skill = null,
    size = 0, 
    skip = 0,
    isRequests = false,
    isSuspended = null,
    date = null,
    startingDate = null,
    endingDate = null,
    userName = null,
    withReviewedOrdersCount = false,
    withTotalOrdersCount = false,
    withTotalJobpostCount = false,
}) => {
            
    const filterStages = [];

    // NOTE: excluding the deleted entries
    filterStages.push(
        { 
            $match: { isDeleted: { $ne: true } } 
        }
    )

    // NOTE: filter by user id
    if(user){
        filterStages.push(
            {
                $match: {_id: new mongoose.Types.ObjectId(user)}
            }
        )
    }

    // NOTE: filtering only the tasker requests
    if (isRequests) {
        filterStages.push(
            { 
                $match: { isRequest: true } 
            }
        );
        filterStages.push(
            {
                $addFields: {
                    isRegisteredRequest: {
                        $cond: {
                            if: { 
                                $gt: [
                                    { $getField: { field: "primary", input: "$idNumber" } }, 
                                    null
                                ] 
                            },
                            then: true,
                            else: false
                        }
                    }
                }
            }
        );        
    }

    // NOTE: filtering suspended users
    if((isSuspended !== null && isSuspended !== undefined) && isSuspended === true){
        filterStages.push(
            { 
                $match: { isSuspended: true } 
            }
        );
    }

    // NOTE: filtering not suspended/active users
    if((isSuspended !== null && isSuspended !== undefined) && isSuspended === false){
        filterStages.push(
            {
                $match: {
                    $or: [
                        { isSuspended: false },
                        { isSuspended: { $ne: true } } 
                    ]
                } 

            }
        );
    }

    // NOTE: filter users based on their role
    if(!isRequests && type){        
        filterStages.push(
            {
                $match: {
                    roles: { $in: [type] }
                }
            }
        );
    }

    // NOTE: filter users based on their excluding role
    if(excludingType){        
        filterStages.push(
            {
                $match: {
                    roles: { $nin: [`${excludingType}`] }
                }
            }
        );
    }

    // NOTE: filter records based on given category
    if(category){
        filterStages.push(
            {
                $match: {
                    "professionalDetails.primary.categoryName": category
                }
            }
        )
    }

    // NOTE: filter records based on given skill
    if(category && skill){
        filterStages.push(
            {
                $match: {
                    "professionalDetails.primary.skills": {
                        $elemMatch: { skillName: skill }
                    }
                }
            }
        )
    }

    // NOTE: filter records based on given city
    if(city){
        filterStages.push(
            {
                $match: {
                    "servingAreas.primary.cityName": city
                }
            }
        )
    }

    // NOTE: filter records based on given sub city
    if(city && subcity){
        filterStages.push(
            {
                $match: {
                    "servingAreas.primary.subcities": subcity
                }
            }
        )
    }

    
    // NOTE: filter by created time matching wtih exact date
    if(date){
        if(isRequests){
            filterStages.push(
                {
                    $match: {
                        $expr: {
                            $eq: [
                                { $dateToString: { format: "%Y-%m-%d", date: "$taskerRequestedAt" } },
                                date
                            ]
                        }
                    }
                }
            )
        }else{
            filterStages.push(
                {
                    $match: {
                        $expr: {
                            $eq: [
                                { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                                date
                            ]
                        }
                    }
                }
            )
        }
    }

    // NOTE: filter records within a specified date range
    if(startingDate){
        if(isRequests){
            filterStages.push(
                {
                    $match: {
                        $expr: {
                            $gte: [
                                { $dateToString: { format: "%Y-%m-%d", date: "$taskerRequestedAt" } },
                                startingDate
                            ]
                        }
                    }
                }
            );
        }else{
            filterStages.push(
                {
                    $match: {
                        $expr: {
                            $gte: [
                                { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                                startingDate
                            ]
                        }
                    }
                }
            );
        }
    }

    if(endingDate){
        if(isRequests){
            filterStages.push(
                {
                    $match: {
                        $expr: {
                            $lte: [
                                { $dateToString: { format: "%Y-%m-%d", date: "$taskerRequestedAt" } },
                                endingDate
                            ]
                        }
                    }
                }
            );
        }else{
            filterStages.push(
                {
                    $match: {
                        $expr: {
                            $lte: [
                                { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                                endingDate
                            ]
                        }
                    }
                }
            );
        }
    }

    // NOTE: Case-insensitive partial match for user name and custom id
    if(userName){
        // NOTE: concating both user first name and last name -> then save within new temp field
        filterStages.push(
            {
                $addFields: {
                    fullNameUser: { $concat: ["$firstName", " ", "$lastName"] },
                }
            }
        )

        // NOTE: Case-insensitive partial match
        filterStages.push(
            {
                $match: {
                    $or: [
                        {fullNameUser: { $regex: userName, $options: "i" } },
                        {id: { $regex: userName, $options: "i" } },
                    ]
                }
            }
        )
    }
    
    // base aggregate stage without any skipping documents or limitting documents
    const baseStage = [
        ...filterStages,
    ];

    // NOTE: sorting records based on created date ..
    baseStage.push(
        {
            $sort: { createdAt: -1}
        }
    );

    const paginatedStage = [...baseStage];

    if(size && size > 0){
        paginatedStage.push({$skip : skip});
        paginatedStage.push({$limit: size})
    }

    // NOTE: total reviewd orders
    if(withReviewedOrdersCount){
        paginatedStage.push(
            {
                $lookup: {
                    from: "orders",
                    let: { taskerId: { $toString: "$_id" } }, // Convert _id to string
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: [{ $toString: "$tasker" }, "$$taskerId"] } 
                            }
                        },
                        {
                            $match: { userReview: { $exists: true } } // Ensure userReview exists
                        }
                    ],
                    as: "reviewedOrders"
                }
            },
        )
    }

    // NOTE: total completed orders
    if(withTotalOrdersCount){
        paginatedStage.push(
            {
                $lookup: {
                    from: "orders",
                    let: { taskerId: { $toString: "$_id" } }, // Convert _id to string
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: [{ $toString: "$tasker" }, "$$taskerId"] } 
                            }
                        },
                        {
                            $match : {"orderProgress.progressStatus": { $in: [`${commonConstants.orderStatus.COMPLETED}`] }}
                        }
                    ],
                    as: "totolCompletedOrders"
                }
            }
        )
    }

    
    // NOTE: total jobpost count
    if(withTotalJobpostCount){
        paginatedStage.push(
            {
                $lookup: {
                    from: "jobposts",
                    let: { userId: { $toString: "$_id" } }, // Convert _id to string
                    pipeline: [
                        {
                            $match: {
                                $and: [
                                    {$expr: { $eq: [{ $toString: "$createdBy" }, "$$userId"] } },
                                    {isDeleted: { $ne: true }}
                                ]
                                
                            }
                        },
                    ],
                    as: "totolPostedJobs"
                }
            }
        )
    }

    // NOTE: geerating pagination model
    // if the size was given and given size is greater than zer0.. it mens the pagination
    // pagination need two stages; purestage and with limit/skip stage to find total number of records
    if(size && size > 0){        
        return{
            baseStage: size && size > 0 ? paginatedStage : baseStage,
            withoutSkipAndLimitStage: baseStage,
        }
    }else{ // if no need a pagination just return the base satge
        return{
            baseStage: baseStage,
            withoutSkipAndLimitStage: baseStage,
        }
    }
}

exports.getSingleTaskersStages = ({userId}) => {return [
    {
        $match: { 
            _id: new mongoose.Types.ObjectId(userId), 
            // isDeleted: false 
            $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }]
        }    
    },
    {
        $lookup: {
            from: "orders",
            let: { tasker: "$_id" },
            pipeline: [
                {
                    $match: {
                        $expr: { $eq: ["$tasker", "$$tasker"] }, // Match userId
                        userReview: { $exists: true, $ne: null }  // Filter orders with userReview
                    }
                }
            ],
            as: "reviewedOrders"
        }
    },
    {
        $lookup: {
            from: "orders",
            let: { taskerId: { $toString: "$_id" } }, // Convert _id to string
            pipeline: [
                {
                    $match: {
                        $expr: { $eq: [{ $toString: "$tasker" }, "$$taskerId"] } 
                    }
                },
                {
                    $match : {"orderProgress.progressStatus": { $in: [`${commonConstants.orderStatus.COMPLETED}`] }}
                }
            ],
            as: "totolCompletedOrders"
        }
    },
    {
        $project: { password: 0 } // Exclude password field
    }
]}