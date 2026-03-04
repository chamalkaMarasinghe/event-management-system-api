const mongoose = require("mongoose");
const {  } = require("../constants/commonConstants");
const commonConstants = require("../constants/commonConstants");

// NOTE: get all events, client their booked events 
exports.getServiceProvidersPipeline = ({
    title = null,
    category = null,
    // status = null,
    // location = null,
    date = null,
    startingDate = null, 
    endingDate = null,
    isRequests = null,
    // isComplaints = false,
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

    // NOTE: filtering service provider requests
    if(isRequests){
        filterStages.push(
            {
                $match: {
                    $and: [
                        {isStillProcessing : true}
                    ]
                }
            }
        )
    }else if (isRequests === false){
        filterStages.push(
            {
                $match: {
                    $and: [
                        {isOnboardingVerified : true}
                    ]
                }
            }
        )
    }

    // NOTE : filter service provider name name  
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
                        {"businessInformation.name": { $regex: title, $options: "i" } },
                    ]
                }
            }
        )
    }

    // Note: filtering service providers based on verified date or requested date
    if(startingDate){
        if(isRequests){
            filterStages.push(
                {
                    $match: {
                        $expr: {
                            $gte: [
                                { $dateToString: { format: "%Y-%m-%d", date: "$onboardingRequestdAt" } },
                                startingDate
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
                            $gte: [
                                { $dateToString: { format: "%Y-%m-%d", date: "$onboardingApprovedAt" } },
                                startingDate
                            ]
                        }
                    }
                }
            )
        }
    }
    if(endingDate){
        if(isRequests){
            filterStages.push(
                {
                    $match: {
                        $expr: {
                            $lte: [
                                { $dateToString: { format: "%Y-%m-%d", date: "$onboardingRequestdAt" } },
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
                                { $dateToString: { format: "%Y-%m-%d", date: "$onboardingApprovedAt" } },
                                endingDate
                            ]
                        }
                    }
                }
            );
        }
    }

    // NOTE: Filter by category
    if (category) {
        filterStages.push({
            $match: {
                $or: [
                    { "businessInformation.category": { $regex: `.*${category}.*`, $options: "i" } },
                ]
            }
        });
    }

    const baseStage = [
        ...filterStages,
        {$project: {password: 0}}
    ];

    if (isRequests === false){
        baseStage.push({ $sort: { onboardingApprovedAt: -1 } });
    }else{
        // NOTE: Sort latest first
        baseStage.push({ $sort: { createdAt: -1 } });
    }


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
