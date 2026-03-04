const mongoose = require("mongoose");
const commonConstants = require("../constants/commonConstants");

exports.getSingleEventPipeline = ({
    id = null
}) => {
    filterStages = [];

    // NOTE: excluding the deleted entries
    filterStages.push(
        { 
            $match: { isDeleted: { $ne: true } } 
        }
    )
    
    if(id){        
        filterStages.push({
            $match: { _id : new mongoose.Types.ObjectId(id) }
        })
    }

    filterStages.push(
        {
            $addFields: {
                participantCount: {
                    $cond: [
                        { $eq: ["$schedulingType", commonConstants.schedulingType.ONETIME] },
                        { $size: { $ifNull: ["$participants", []] } },
                        {
                            $let: {
                                vars: {
                                    futureDates: {
                                        $filter: {
                                            input: "$recurringEventsDates",
                                            as: "date",
                                            cond: { $gte: ["$$date.start", new Date()] }
                                        }
                                    }
                                },
                                in: {
                                    $cond: [
                                        { $gt: [{ $size: "$$futureDates" }, 0] },
                                        {
                                            $let: {
                                                vars: {
                                                    nearest: {
                                                        $arrayElemAt: [
                                                            {
                                                                $slice: [
                                                                    {
                                                                        $sortArray: {
                                                                        input: "$$futureDates",
                                                                        sortBy: { start: 1 }
                                                                        }
                                                                    },
                                                                    1
                                                                ]
                                                            },
                                                            0
                                                        ]
                                                    }
                                                },
                                                in: {
                                                    $size: { $ifNull: ["$$nearest.participants", []] }
                                                }
                                            }
                                        },
                                        0
                                    ]
                                }
                            }
                        }
                    ]
                }
            }
        }
    )

    filterStages.push(
        {
            $addFields: {
                dateToBeCompared: {
                    $ifNull: ['$date', '$eventEndDate']
                }
            }
        },
    );

    filterStages.push(
        {
            $addFields: {
                timelineStatus: {
                $cond: [
                    { $gte: ["$dateToBeCompared", new Date()] },
                    commonConstants.CLIENT_ORDERS_TABLE_TABS.UPCOMING,
                    commonConstants.CLIENT_ORDERS_TABLE_TABS.COMPLETED
                ]
                }
            }
        }
    )

    filterStages.push(
        // NOTE: Populate organizer
        {
            $lookup: {
                from: 'serviceproviders',
                localField: 'organizer',
                foreignField: '_id',
                as: 'organizer'
            }
        },
        {
            $unwind: {
                path: '$organizer',
                preserveNullAndEmptyArrays: true
            }
        },
    )

    return filterStages;
}

// NOTE: get all events, client their booked events 
exports.getEventPipeline = ({
    heroSearchTerm,
    title = null,
    category = null,
    payment_status = null,
    status = null,
    location = null,
    locationLongitude = null,
    locationLatitude = null,
    date = null,
    startingDate = null, 
    endingDate = null,
    isOrders = false,
    isComplaints = false,
    userId,
    userRoles = [],
    serviceProviderId,
    longitude = null,
    latitude = null,
    isNearbyEvents = false,
    limit = 0,
    skip = 0,
}) => {

    // NOTE: if the request coming from client application , reseting the status value to all if the user searchs something on the search bar
    if(title && title?.length > 0 && !userRoles?.includes(commonConstants.roles.ADMIN) && !userRoles?.includes(commonConstants.roles.SERVICE_PRO)){
        status = commonConstants.CLIENT_ORDERS_TABLE_TABS.ALL;
    }

    const filterStages = [];    
    
    //NOTE: filter events by nearst locations and calculating the distance from current location to the event location
    if (longitude && longitude !== 1 && latitude && latitude !== 1 && isNearbyEvents) {        
        filterStages.push({
            $geoNear: {
                near: {
                    type: "Point",
                    coordinates: [parseFloat(longitude), parseFloat(latitude)]
                },
                distanceField: "distanceInMeters",
                maxDistance: commonConstants.maxDistanceToFindNearbyEventsInMeters,
                spherical: true
            }
        });
        filterStages.push({
            $addFields: {
                distanceInKm: {
                    $floor: [
                        { $divide: ["$distanceInMeters", 1000] },
                    ]
                }
            }
        });
        filterStages.push(
            { 
                $match: { isDeleted: { $ne: true } } 
            }
        )
    }else if(longitude && longitude !== 1 && latitude && latitude !== 1 && !locationLongitude && !locationLatitude && !location){
        filterStages.push({
            $geoNear: {
                near: {
                    type: "Point",
                    coordinates: [parseFloat(longitude), parseFloat(latitude)]
                },
                distanceField: "distanceInMeters",
                maxDistance: 20000000, // 20000 km - find all events
                spherical: true
            }
        });
        filterStages.push({
            $addFields: {
                distanceInKm: {
                    $floor: [
                        { $divide: ["$distanceInMeters", 1000] },
                    ]
                }
            }
        });
        filterStages.push(
            { 
                $match: { isDeleted: { $ne: true } } 
            }
        )
    }else if(locationLongitude && locationLatitude && location){        
        filterStages.push({
            $geoNear: {
                near: {
                    type: "Point",
                    coordinates: [parseFloat(locationLongitude), parseFloat(locationLatitude)]
                },
                distanceField: "distanceInMeters",
                maxDistance: commonConstants.maxDistanceToFindLocationFilterEventsInMeters, // find near events for provided location filter
                spherical: true
            }
        });
        filterStages.push({
            $addFields: {
                distanceInKm: {
                    $floor: [
                        { $divide: ["$distanceInMeters", 1000] },
                    ]
                }
            }
        });
        filterStages.push(
            { 
                $match: { isDeleted: { $ne: true } } 
            }
        )
    }

    // NOTE: excluding the deleted entries
    // filterStages.push(
    //     { 
    //         $match: { isDeleted: { $ne: true } } 
    //     }
    // )

    // NOTE: Exclude PRIVATE events if not fetching user orders -- AND -- excluding past events(old events)
    if (!isOrders && !isComplaints && !userRoles?.includes(commonConstants.roles.ADMIN) && !userRoles?.includes(commonConstants.roles.SERVICE_PRO)) {               
        filterStages.push(
            { 
                $match: { isDeleted: { $ne: true } } 
            }
        );
        filterStages.push({
            $match: {
                eventType: { $ne: commonConstants.eventType.PRIVATE }
            }
        });
        filterStages.push(
            {
                $addFields: {
                    dateToBeCompared: {
                        $ifNull: ['$date', '$eventEndDate']
                    }
                }
            },
            {
                $match: {
                    $or: [
                        { dateToBeCompared: { $gte: new Date() } },
                        { dateToBeCompared: null }
                    ]
                }
            }
        );
    }

    if(serviceProviderId && !userRoles?.includes(commonConstants.roles.ADMIN)){       
        filterStages.push(
            { 
                $match: { isDeleted: { $ne: true } } 
            }
        ); 
        filterStages.push({
            $match: { organizer : new mongoose.Types.ObjectId(serviceProviderId) }
        })
        filterStages.push(
            {
                $addFields: {
                    totalRecurringSubEvents: {
                        $cond: [
                            { $eq: ["$schedulingType", commonConstants.schedulingType.RECURRING] },
                            { $size: { $ifNull: ["$recurringEventsDates", []] } },
                            0
                        ]
                    },
                    completedRecurringSubEvents: {
                        $cond: [
                            { $eq: ["$schedulingType", commonConstants.schedulingType.RECURRING] },
                            {
                                $size: {
                                    $filter: {
                                        input: "$recurringEventsDates",
                                        as: "recEvent",
                                        cond: {
                                            $lt: ["$$recEvent.end", new Date()]
                                        }
                                    }
                                }
                            },
                            0
                        ]
                    }
                }
            }
        )
    }

    // NOTE: ========== COMPLAINTS HANDLING ==========
    if (isComplaints) {
        filterStages.push(
            { 
                $match: { isDeleted: { $ne: true } } 
            }
        );
        filterStages.push(
            { $unwind: "$complaint" }, // separate complaints as individual records
            {
                $addFields: {
                    complaintId: "$complaint.id",
                    complaintObjectId: "$complaint._id",
                    bookingId: "$complaint.bookingId",
                    complaintType: "$complaint.complaintType",
                    complaintDescription: "$complaint.description",
                    complaintAttachment: "$complaint.attachment",
                    complaintClient: "$complaint.client",
                    complaintClientName: "$complaint.clientName",
                    complaintClientEmail: "$complaint.clientEmail",
                    complaintStatus: "$complaint.status",
                    complaintDateSubmitted: "$complaint.dateSubmitted",
                    complaintDateResolved: "$complaint.dateResolved"
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "complaintClient",
                    foreignField: "_id",
                    as: "complaintClientDetails"
                }
            },
            {
                $unwind: {
                    path: "$complaintClientDetails",
                    preserveNullAndEmptyArrays: true
                }
            }
        );
    }

    // NOTE: calculating the current booked user count >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    filterStages.push(
        {
            $addFields: {
                participantCount: {
                    $cond: [
                        { $eq: ["$schedulingType", commonConstants.schedulingType.ONETIME] },
                        { $size: { $ifNull: ["$participants", []] } },
                        {
                            $let: {
                                vars: {
                                    futureDates: {
                                        $filter: {
                                            input: "$recurringEventsDates",
                                            as: "date",
                                            cond: { $gte: ["$$date.start", new Date()] }
                                        }
                                    }
                                },
                                in: {
                                    $cond: [
                                        { $gt: [{ $size: "$$futureDates" }, 0] },
                                        {
                                            $let: {
                                                vars: {
                                                    nearest: {
                                                        $arrayElemAt: [
                                                            {
                                                                $slice: [
                                                                    {
                                                                        $sortArray: {
                                                                        input: "$$futureDates",
                                                                        sortBy: { start: 1 }
                                                                        }
                                                                    },
                                                                    1
                                                                ]
                                                            },
                                                            0
                                                        ]
                                                    }
                                                },
                                                in: {
                                                    $size: { $ifNull: ["$$nearest.participants", []] }
                                                }
                                            }
                                        },
                                        0
                                    ]
                                }
                            }
                        }
                    ]
                }
            }
        }
    )

    // NOTE: If fetching user's orders
    if (isOrders && userId && !isComplaints) {
        const userObjectId = new mongoose.Types.ObjectId(userId);

        filterStages.push({
            $match: {
                $or: [
                    // Case 1: ONETIME events
                    {
                        $and: [
                            { schedulingType: commonConstants.schedulingType.ONETIME },
                            { participants: { $elemMatch: { user: userObjectId } } }
                        ]
                    },
                    // Case 2: RECURRING events
                    {
                        $and: [
                            { schedulingType: commonConstants.schedulingType.RECURRING },
                            {
                                recurringEventsDates: {
                                    $elemMatch: {
                                        participants: { $elemMatch: { user: userObjectId } }
                                    }
                                }
                            }
                        ]
                    }
                ]
            }
        });

        // Handle RECURRING: unwind recurring dates
        filterStages.push(
            {
                $unwind: {
                    path: "$recurringEventsDates",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $match: {
                    $or: [
                        { schedulingType: commonConstants.schedulingType.ONETIME },
                        {
                            $and: [
                                { schedulingType: commonConstants.schedulingType.RECURRING },
                                { "recurringEventsDates.participants.user": userObjectId }
                            ]
                        }
                    ]
                }
            },
            {
                $addFields: {
                    startDate: {
                        $cond: [
                            { $eq: ["$schedulingType", commonConstants.schedulingType.RECURRING] },
                            "$recurringEventsDates.start",
                            { $ifNull: ["$date", "$eventStartDate"] }
                        ]
                    },
                    endDate: {
                        $cond: [
                            { $eq: ["$schedulingType", commonConstants.schedulingType.RECURRING] },
                            "$recurringEventsDates.end",
                            "$eventEndDate"
                        ]
                    },
                    participants: {
                        $cond: [
                            { $eq: ["$schedulingType", commonConstants.schedulingType.RECURRING] },
                            "$recurringEventsDates.participants",
                            "$participants"
                        ]
                    }
                }
            },
            // Extract the specific participant for this user
            {
                $addFields: {
                    currentUserParticipant: {
                        $first: {
                            $filter: {
                                input: "$participants",
                                as: "p",
                                cond: { $eq: ["$$p.user", userObjectId] }
                            }
                        }
                    }
                }
            },
            // Add your two new temporary fields
            {
                $addFields: {
                    isRefunded: "$currentUserParticipant.isRefunded",
                    isEventCancelledByServiceProvider: "$currentUserParticipant.isEventCancelledByServiceProvider",
                    bookingId: "$currentUserParticipant.bookingId",
                    // user: "$currentUserParticipant.isRefunded",
                    date: "$currentUserParticipant.date",
                    paymentStatus: "$currentUserParticipant.paymentStatus",
                    paymentMethod: "$currentUserParticipant.paymentMethod",
                    userSelectedPaymentMethod: "$currentUserParticipant.userSelectedPaymentMethod",
                    paymentAmount: "$currentUserParticipant.paymentAmount",
                    subscriptionId: "$currentUserParticipant.subscriptionId",
                    paymentIntentId: "$currentUserParticipant.paymentIntentId",
                    serviceProviderAmount: "$currentUserParticipant.serviceProviderAmount",
                    stripeProcessingFee: "$currentUserParticipant.stripeProcessingFee",
                    subscriptionStartDate: "$currentUserParticipant.subscriptionStartDate",
                    subscriptionEndDate: "$currentUserParticipant.subscriptionEndDate",
                    subscriptionCancelDate:"$currentUserParticipant.subscriptionCancelDate",
                    chargeId: "$currentUserParticipant.chargeId",
                    transferId: "$currentUserParticipant.transferId",
                    renewalReminderSent: "$currentUserParticipant.renewalReminderSent"
                }
            },
            {
                $unset: ["recurringEventsDates", "currentUserParticipant"]
            }
        );

        // NOTE:my orders table payment status filter
        if(payment_status && payment_status?.length > 0){
            if(payment_status?.toUpperCase() === commonConstants.payoutStatus.COMPLETED){
                filterStages.push(
                    {
                        $match: { paymentStatus: `${commonConstants.paymentStatus.PAID}` } 
                    }
                )
            } else if(payment_status?.toUpperCase() === commonConstants.payoutStatus.PENDING){
                filterStages.push(
                    {
                        $match: { paymentStatus: `${commonConstants.paymentStatus.PENDING}` } 
                    }
                )
            }
        }
    } else {
        // NOTE: If not orders, derive startDate from date or eventStartDate
        filterStages.push({
            $addFields: {
                startDate: {
                    $ifNull: ['$date', '$eventStartDate']
                }
            }
        });
    }

    if(!isOrders && userRoles?.includes(commonConstants.roles.ADMIN)){
        filterStages.push(
            // {
            //     $unwind: {
            //         path: "$recurringEventsDates",
            //         preserveNullAndEmptyArrays: true
            //     }
            // },
            // {
            //     $match: {
            //         $or: [
            //             { schedulingType: commonConstants.schedulingType.ONETIME },
            //             {
            //                 $and: [
            //                     { schedulingType: commonConstants.schedulingType.RECURRING },
            //                     { "recurringEventsDates.participants.user": userObjectId }
            //                 ]
            //             }
            //         ]
            //     }
            // },
            {
                $addFields: {
                    startDate: {
                        $cond: [
                            { $eq: ["$schedulingType", commonConstants.schedulingType.RECURRING] },
                            "$eventStartDate",
                            { $ifNull: ["$date", "$eventStartDate"] }
                        ]
                    },
                    endDate: {
                        $cond: [
                            { $eq: ["$schedulingType", commonConstants.schedulingType.RECURRING] },
                            "$eventEndDate",
                            "$eventEndDate"
                        ]
                    },
                    // participants: {
                    //     $cond: [
                    //         { $eq: ["$schedulingType", commonConstants.schedulingType.RECURRING] },
                    //         "$recurringEventsDates.participants",
                    //         "$participants"
                    //     ]
                    // }
                }
            },
            // {
            //     $unset: "recurringEventsDates"
            // }
        );
    }

    // NOTE: Apply upcoming/completed status filtering
    if (
        ((isOrders && status && status.length > 0) || (userRoles?.includes(commonConstants.roles.ADMIN) && status && status.length > 0)) &&
        (status && status.length > 0 && status !== commonConstants.CLIENT_ORDERS_TABLE_TABS.ALL)
    ) {
        filterStages.push(
            {
                $match: {
                    startDate: { $ne: null }
                }
            },
            {
                $match: {
                    ...(status === commonConstants.CLIENT_ORDERS_TABLE_TABS.UPCOMING
                        ? { startDate: { $gte: new Date() } }
                        : status === commonConstants.CLIENT_ORDERS_TABLE_TABS.COMPLETED
                            ? { startDate: { $lt: new Date() } }
                            : {})
                }
            }
        );
    }

    //heroSearchTerm
    // NOTE: Filter by herso section main search term
    if (heroSearchTerm && !isComplaints && heroSearchTerm.length > 0 && !userRoles?.includes(commonConstants.roles.ADMIN)) {                
        filterStages.push({
            $match: {
                $or: [
                    { name: { $regex: `.*${heroSearchTerm}.*`, $options: "i" } },
                    { id: { $regex: `.*${heroSearchTerm}.*`, $options: "i" } },
                    { category: { $regex: `.*${heroSearchTerm}.*`, $options: "i" } },
                    { description: { $regex: `.*${heroSearchTerm}.*`, $options: "i" } },
                    { eventType: { $regex: `.*${heroSearchTerm}.*`, $options: "i" } }
                ]
            }
        });
    }

    // NOTE: Filter by title
    if (title && !isComplaints && title.length > 0 && !userRoles?.includes(commonConstants.roles.ADMIN)) {        
        filterStages.push({
            $match: {
                $or: [
                    { name: { $regex: `.*${title}.*`, $options: "i" } },
                    { id: { $regex: `.*${title}.*`, $options: "i" } }
                ]
            }
        });
    }

    // NOTE: Filter by title - filtering complaints
    if (title && isComplaints && title.length > 0 && !userRoles?.includes(commonConstants.roles.ADMIN)) {        
        filterStages.push({
            $match: {
                $or: [
                    { complaintClientName: { $regex: `.*${title}.*`, $options: "i" } },
                    { bookingId: { $regex: `.*${title}.*`, $options: "i" } }
                ]
            }
        });
    }

    // NOTE: Filter by category
    if (category && !isComplaints && category.length > 0) {
        filterStages.push({
            $match: {
                category: { $regex: `.*${category}.*`, $options: "i" }
            }
        });
    }

    // NOTE: Filter by category - filtering complaints
    if (category && isComplaints && category.length > 0) {
        filterStages.push({
            $match: {
                complaintType: { $regex: `.*${category}.*`, $options: "i" }
            }
        });
    }

    // NOTE: Filter by location
    // if (location && location.length > 0 && !userRoles?.includes(commonConstants.roles.ADMIN)) {
    //     filterStages.push({
    //         $match: {
    //             "eventLocations.address": { $regex: `.*${location}.*`, $options: "i" }
    //         }
    //     });
    // }

    // NOTE: Filter by specific date (YYYY-MM-DD)
    if (date) {
        filterStages.push(
            {
                $match: {
                    startDate: { $ne: null }
                }
            },
            {
                $match: {
                    $expr: {
                        $eq: [
                            { $dateToString: { format: "%Y-%m-%d", date: "$startDate" } },
                            date
                        ]
                    }
                }
            }
        );
    }

    // Note: filtering complaints based on date range - filtering complaints
    if(startingDate){
        if(isComplaints){
            filterStages.push(
                {
                    $match: {
                        $expr: {
                            $gte: [
                                { $dateToString: { format: "%Y-%m-%d", date: "$complaintDateSubmitted" } },
                                startingDate
                            ]
                        }
                    }
                }
            )
        }else if(userRoles?.includes(commonConstants.roles.ADMIN)){
            filterStages.push(
                {
                    $match: {
                        $expr: {
                            $gte: [
                                { $dateToString: { format: "%Y-%m-%d", date: "$startDate" } },
                                startingDate
                            ]
                        }
                    }
                }
            )
        }
    }
    if(endingDate){
        if(isComplaints){
            filterStages.push(
                {
                    $match: {
                        $expr: {
                            $lte: [
                                { $dateToString: { format: "%Y-%m-%d", date: "$complaintDateSubmitted" } },
                                endingDate
                            ]
                        }
                    }
                }
            );
        }else if(userRoles?.includes(commonConstants.roles.ADMIN)){
            filterStages.push(
                {
                    $match: {
                        $expr: {
                            $lte: [
                                { $dateToString: { format: "%Y-%m-%d", date: "$startDate" } },
                                endingDate
                            ]
                        }
                    }
                }
            );
        }
    }

    const baseStage = [
        ...filterStages,

        // NOTE: adding the aditional field to track the completed or upcoming event status
        // {
        //     $match: {
        //         startDate: { $ne: null }
        //     }
        // },

        // {
        //     $addFields: {
        //         timelineStatus: {
        //         $cond: [
        //             { $gte: ["$startDate", new Date()] },
        //             commonConstants.CLIENT_ORDERS_TABLE_TABS.UPCOMING,
        //             commonConstants.CLIENT_ORDERS_TABLE_TABS.COMPLETED
        //         ]
        //         }
        //     }
        // }
    ];

    if(status && status.length > 0 && status === commonConstants.CLIENT_ORDERS_TABLE_TABS.ALL){
        baseStage.push(
            {
                $addFields: {
                    timelineStatus: commonConstants.CLIENT_ORDERS_TABLE_TABS.ALL
                }
            }
        )
    }else {
        baseStage.push(
            {
                $addFields: {
                    timelineStatus: {
                    $cond: [
                        { $gte: ["$startDate", new Date()] },
                        commonConstants.CLIENT_ORDERS_TABLE_TABS.UPCOMING,
                        commonConstants.CLIENT_ORDERS_TABLE_TABS.COMPLETED
                    ]
                    }
                }
            }
        )
    }

    if(!isComplaints){
        baseStage.push(
            // NOTE: Populate organizer
            {
                $lookup: {
                    from: 'serviceproviders',
                    localField: 'organizer',
                    foreignField: '_id',
                    as: 'organizer'
                }
            },
            {
                $unwind: {
                    path: '$organizer',
                    preserveNullAndEmptyArrays: true
                }
            },
        )
    }

    // NOTE : filter order by organizer name or business name  
    if(title && userRoles?.includes(commonConstants.roles.ADMIN)){
        // NOTE: concating both user first name and last name -> then save within new temp field
        baseStage.push(
            {
                $addFields: {
                    fullNameOrganizer: { $concat: ["$organizer.firstName", " ", "$organizer.lastName"] },
                }
            }
        )

        // NOTE: Case-insensitive partial match for business name
        baseStage.push(
            {
                $match: {
                    $or: [
                        {fullNameOrganizer: { $regex: title, $options: "i" } },
                        {"organizer.businessInformation.name": { $regex: title, $options: "i" } },
                        {id: { $regex: title, $options: "i" } },
                        {name: { $regex: title, $options: "i" } },
                    ]
                }
            }
        )
    }

    // NOTE: Sort closest first for clients :::  latest first for admins, service providers
    if((isNearbyEvents) || (longitude && longitude !== 1 && latitude && latitude !== 1) || (locationLongitude && locationLatitude && location)){        
        if (!isOrders && !isComplaints && !userRoles?.includes(commonConstants.roles.ADMIN) && !userRoles?.includes(commonConstants.roles.SERVICE_PRO)) {             
            baseStage.push({ $sort: { distanceInKm: 1 } });
        }else{            
            baseStage.push({ $sort: { createdAt: -1 } });
        }
    }else{        
        baseStage.push({ $sort: { createdAt: -1 } });
    }
    
    // if(isOrders){
    //     baseStage.push({ $sort: { createdAt: -1 } });
    // }
    
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

// NOTE: service pro get the all attendees of a single event
exports.getEventAttendeesPipeline = ({ 
    userId = null,
    eventId = null,
    month = null, 
    skip = 0, 
    limit = 10 
}) => {

    // NOTE: filter out some specifi sub recurrent dates based on month parameter
    let recurring = []    

    if(month){
        recurring = [
            {
                $match: { schedulingType: commonConstants.schedulingType.RECURRING }
            },
            {
                $unwind: "$recurringEventsDates"
            },
            {
                $match: {
                    $expr: {
                        $eq: [
                            { $dateToString: { format: "%Y-%m-%d", date: "$recurringEventsDates.start" } },
                            month
                        ]
                    }
                }
            },
            {
                $unwind: {
                    path: "$recurringEventsDates.participants",
                    preserveNullAndEmptyArrays: false
                }
            },
            {
                $addFields: {
                    eventDate: "$recurringEventsDates.start",
                    participant: "$recurringEventsDates.participants"
                }
            },
            {
                $replaceRoot: {
                    newRoot: {
                        id: "$id",
                        eventId: "$_id",
                        schedulingType: "$schedulingType",
                        eventDate: "$eventDate",
                        bookingDate: "$participant.date",
                        participant: "$participant"
                    }
                }
            }
        ]
    }else{
        recurring = [
            {
                $match: { schedulingType: commonConstants.schedulingType.RECURRING }
            },
            {
                $unwind: "$recurringEventsDates"
            },
            {
                $unwind: {
                    path: "$recurringEventsDates.participants",
                    preserveNullAndEmptyArrays: false
                }
            },
            {
                $addFields: {
                    eventDate: "$recurringEventsDates.start",
                    participant: "$recurringEventsDates.participants"
                }
            },
            {
                $replaceRoot: {
                    newRoot: {
                        id: "$id",
                        eventId: "$_id",
                        schedulingType: "$schedulingType",
                        eventDate: "$eventDate",
                        bookingDate: "$participant.date",
                        participant: "$participant"
                    }
                }
            }
        ]
    }

    const pipeline = [
        
        // NOTE: filter service provider hosted events
        {
            $match: { organizer : new mongoose.Types.ObjectId(userId) }
        },

        // NOTE: filter given specifi event with event id
        {
            $match: { _id: new mongoose.Types.ObjectId(eventId) }
        },

        // NOTE: excluding the deleted entries
        { 
            $match: { isDeleted: { $ne: true } } 
        },

        // NOTE: Unwind ONETIME participants
        {
            $project: {
                _id: 1,
                id: 1,
                schedulingType: 1,
                participants: 1,
                recurringEventsDates: 1,
                date: 1
            }
        },

        {
            $facet: {
                onetime: [
                    {
                        $match: { schedulingType: commonConstants.schedulingType.ONETIME }
                    },
                    {
                        $unwind: {
                            path: '$participants',
                            preserveNullAndEmptyArrays: false
                        }
                    },
                    {
                        $addFields: {
                            bookingDate: "$participants.date",
                            participant: "$participants",
                            eventDate: "$date"
                        }
                    },
                    {
                        $replaceRoot: {
                            newRoot: {
                                id: "$id",
                                eventId: "$_id",
                                schedulingType: "$schedulingType",
                                bookingDate: "$bookingDate",
                                eventDate: "$eventDate",
                                participant: "$participant"
                            }
                        }
                    }
                ],
                recurring
            }
        },

        // NOTE: Merge onetime + recurring
        {
            $project: {
                attendees: { $concatArrays: ["$onetime", "$recurring"] }
            }
        },

        { $unwind: "$attendees" },
        { $replaceRoot: { newRoot: "$attendees" } },

        // NOTE: Populate user
        {
            $lookup: {
                from: "users",
                localField: "participant.user",
                foreignField: "_id",
                as: "participant.user"
            }
        },
        {
            $unwind: {
                path: "$user",
                preserveNullAndEmptyArrays: true
            }
        },
        { $project: { "participant.user.password": 0 }},

        {
            $match: { bookingDate: { $ne: null} }
        },

        {
            $match: {
                $or: [
                    {
                        $and: [
                            { "participant.userSelectedPaymentMethod": { $ne: commonConstants.userSelectedPaymentMethod.INHOUSE} },
                            { "participant.paymentStatus": { $ne: commonConstants.paymentStatus.PENDING} }
                        ],
                    },
                    {
                        $and: [
                            { "participant.userSelectedPaymentMethod": commonConstants.userSelectedPaymentMethod.INHOUSE },
                            { "participant.paymentStatus": commonConstants.paymentStatus.PENDING }
                        ]
                    }
                ]
            }
        }

        
    ];

    // if(month){
    //     const monthIndex = (commonConstants?.monthOptions?.findIndex(it => it?.value === month) || 0) + 1
    //     pipeline.push({
    //         $match: {
    //             $expr: {
    //                 $and: [
    //                     { $eq: [{ $month: "$bookingDate" }, monthIndex] } //month taken from 1 to 12
    //                 ]
    //             }
    //         }
    //     })
    // }
    
    // NOTE: Optional sort
    pipeline.push({        
        $sort: { bookingDate: -1 } 
    })
    
    // NOTE: Pagination
    pipeline.push({
        $facet: {
            paginatedData: [{ $skip: skip }, { $limit: limit }],
            metaData: [{ $count: "totalCount" }]
        }
    })
    
    return pipeline;
};

// NOTE: service pro get the all attendees of all events
exports.getAllEventAttendeesPipeline = ({ 
    userId = null,
    title,
    status = null,
    skip = 0, 
    limit = 10 
}) => {

    
    // NOTE: reseting the status value to all if the user searchs something on the search bar
    if(title && title?.length > 0 ){
        status = commonConstants.CLIENT_ORDERS_TABLE_TABS.ALL;
    }

    const filterStages = [];
    
    filterStages.push(
        { 
            $match: { isDeleted: { $ne: true } } 
        }
    )

    // NOTE: filter service provider hosted events
    filterStages.push(
        {
            $match: { organizer : new mongoose.Types.ObjectId(userId) }
        },
    )

    const pipeline = [

        ...filterStages,
        
        // NOTE: Unwind ONETIME participants
        {
            $project: {
                name: 1,
                eventLocations: 1,
                price: 1,
                id: 1,
                schedulingType: 1,
                participants: 1,
                recurringEventsDates: 1,
                _id: 1,
                organizer: 1,
                date: 1,
            }
        },

        {
            $facet: {
                onetime: [
                    {
                        $match: { schedulingType: commonConstants.schedulingType.ONETIME }
                    },
                    {
                        $unwind: {
                            path: '$participants',
                            preserveNullAndEmptyArrays: false
                        }
                    },
                    {
                        $addFields: {
                            orderDate: "$participants.date",
                            participant: "$participants"
                        }
                    },
                    {
                        $replaceRoot: {
                            newRoot: {
                                name: "$name",
                                eventLocations: "$eventLocations",
                                price: "$price",
                                id: "$id",
                                eventId: "$_id",
                                schedulingType: "$schedulingType",
                                eventDate: "$date",
                                orderDate: "$orderDate",
                                participant: "$participant"
                            }
                        }
                    }
                ],
                recurring: [
                    {
                        $match: { schedulingType: commonConstants.schedulingType.RECURRING }
                    },
                    {
                        $unwind: "$recurringEventsDates"
                    },
                    {
                        $unwind: {
                            path: "$recurringEventsDates.participants",
                            preserveNullAndEmptyArrays: false
                        }
                    },
                    {
                        $addFields: {
                            eventDate: "$recurringEventsDates.start",
                            participant: "$recurringEventsDates.participants"
                        }
                    },
                    {
                        $replaceRoot: {
                            newRoot: {
                                name: "$name",
                                eventLocations: "$eventLocations",
                                price: "$price",
                                id: "$id",
                                eventId: "$_id",
                                schedulingType: "$schedulingType",
                                eventDate: "$eventDate",
                                orderDate: "$participant.date",
                                participant: "$participant"
                            }
                        }
                    }
                ]
            }
        },

        // NOTE: Merge onetime + recurring
        {
            $project: {
                attendees: { $concatArrays: ["$onetime", "$recurring"] }
            }
        },

        { $unwind: "$attendees" },
        { $replaceRoot: { newRoot: "$attendees" } },

        // NOTE: Populate user
        {
            $lookup: {
                from: "users",
                localField: "participant.user",
                foreignField: "_id",
                as: "participant.user"
            }
        },
        {
            $unwind: {
                path: "$user",
                preserveNullAndEmptyArrays: true
            }
        },

        // NOTE: Optional sort
        { $sort: { orderDate: -1 } },

        { $project: { "participant.user.password": 0 }},
    ];

    // NOTE: Apply upcoming/completed status filtering
    if (status && status.length > 0 && status !== commonConstants.CLIENT_ORDERS_TABLE_TABS.ALL) {
        pipeline.push(
            {
                $match: {
                    eventDate: { $ne: null }
                }
            },
            {
                $match: {
                    ...(status === commonConstants.CLIENT_ORDERS_TABLE_TABS.UPCOMING
                        ? { eventDate: { $gte: new Date() } }
                        : status === commonConstants.CLIENT_ORDERS_TABLE_TABS.COMPLETED
                            ? { eventDate: { $lt: new Date() } }
                            : {})
                }
            }
        );
    }

    // NOTE: adding the property to track upcoming or completed
    if(status && status.length > 0 && status === commonConstants.CLIENT_ORDERS_TABLE_TABS.ALL){
        pipeline.push(
            {
                $addFields: {
                    timelineStatus: commonConstants.CLIENT_ORDERS_TABLE_TABS.ALL
                }
            }
        )
    }else {
        pipeline.push(
            {
                $addFields: {
                    timelineStatus: {
                    $cond: [
                        { $gte: ["$eventDate", new Date()] },
                        commonConstants.CLIENT_ORDERS_TABLE_TABS.UPCOMING,
                        commonConstants.CLIENT_ORDERS_TABLE_TABS.COMPLETED
                    ]
                    }
                }
            }
        )
    }

    // NOTE: Filter by title
    if (title && title.length > 0) {
        pipeline.push({
            $match: {
                $or: [
                    { name: { $regex: `.*${title}.*`, $options: "i" } },
                    { id: { $regex: `.*${title}.*`, $options: "i" } }
                ]
            }
        });
    }

    pipeline.push(
        {
            $match: { "participant.serviceProviderAmount" : { $ne: null}}
        }
    )

    // NOTE: Pagination
    if (limit && limit > 0) {
        pipeline.push({
            $facet: {
                paginatedData: [{ $skip: skip }, { $limit: limit }],
                metaData: [{ $count: "totalCount" }]
            }
        });
    }

    return pipeline;
};

// NOTE: service pro get booking report of all events
exports.getBookingReportPipeline = ({ 
    title,
    status = null,
    category,
    startingDate,
    endingDate,
    skip = 0, 
    limit = 10 
}) => {
    const filterStages = [];

    const pipeline = [

        ...filterStages,
        
        // NOTE: Unwind ONETIME participants
        {
            $project: {
                _id: 1,
                name: 1,
                eventLocations: 1,
                price: 1,
                id: 1,
                schedulingType: 1,
                participants: 1,
                recurringEventsDates: 1,
                organizer: 1,
                date: 1,
            }
        },

        {
            $facet: {
                onetime: [
                    {
                        $match: { schedulingType: commonConstants.schedulingType.ONETIME }
                    },
                    {
                        $unwind: {
                            path: '$participants',
                            preserveNullAndEmptyArrays: false
                        }
                    },
                    {
                        $addFields: {
                            orderDate: "$participants.date",
                            participant: "$participants"
                        }
                    },
                    {
                        $replaceRoot: {
                            newRoot: {
                                name: "$name",
                                eventLocations: "$eventLocations",
                                price: "$price",
                                id: "$id",
                                eventId: "$_id",
                                schedulingType: "$schedulingType",
                                eventDate: "$date",
                                orderDate: "$orderDate",
                                participant: "$participant",
                                organizer: "$organizer",
                                uid: "$participant._id"
                            }
                        }
                    }
                ],
                recurring: [
                    {
                        $match: { schedulingType: commonConstants.schedulingType.RECURRING }
                    },
                    {
                        $unwind: "$recurringEventsDates"
                    },
                    {
                        $unwind: {
                            path: "$recurringEventsDates.participants",
                            preserveNullAndEmptyArrays: false
                        }
                    },
                    {
                        $addFields: {
                            eventDate: "$recurringEventsDates.start",
                            participant: "$recurringEventsDates.participants"
                        }
                    },
                    {
                        $replaceRoot: {
                            newRoot: {
                                name: "$name",
                                eventLocations: "$eventLocations",
                                price: "$price",
                                id: "$id",
                                eventId: "$_id",
                                schedulingType: "$schedulingType",
                                eventDate: "$eventDate",
                                orderDate: "$participant.date",
                                participant: "$participant",
                                organizer: "$organizer",
                                uid: "$recurringEventsDates.participants._id"
                            }
                        }
                    }
                ]
            }
        },

        // NOTE: Merge onetime + recurring
        {
            $project: {
                attendees: { $concatArrays: ["$onetime", "$recurring"] }
            }
        },

        { $unwind: "$attendees" },
        { $replaceRoot: { newRoot: "$attendees" } },

        // NOTE: Populate user
        {
            $lookup: {
                from: "users",
                localField: "participant.user",
                foreignField: "_id",
                as: "participant.user"
            }
        },
        {
            $unwind: {
                path: "$user",
                preserveNullAndEmptyArrays: true
            }
        },

        // NOTE: Populate organizer
        {
            $lookup: {
                from: 'serviceproviders',
                localField: 'organizer',
                foreignField: '_id',
                as: 'organizer'
            }
        },
        {
            $unwind: {
                path: '$organizer',
                preserveNullAndEmptyArrays: true
            }
        },

        // NOTE: Optional sort
        { $sort: { "participant.date": -1 } },

        { $project: { "participant.user.password": 0 }},
    ];

    const tableRecords = [];

    // Note: filtering bookings based on booking date range - filtering bookings
    if(startingDate){
        tableRecords.push(
            {
                $match: {
                    $expr: {
                        $gte: [
                            { $dateToString: { format: "%Y-%m-%d", date: "$participant.date" } },
                            startingDate
                        ]
                    }
                }
            }
        )
    }
    if(endingDate){
        tableRecords.push(
            {
                $match: {
                    $expr: {
                        $lte: [
                            { $dateToString: { format: "%Y-%m-%d", date: "$participant.date" } },
                            endingDate
                        ]
                    }
                }
            }
        );
    }

    if(category){
        tableRecords.push(
            {
                $match: { "participant.userSelectedPaymentMethod" : category}
            }
        )
    }

    // // NOTE: Apply upcoming/completed status filtering
    // if (status && status.length > 0) {
    //     pipeline.push(
    //         {
    //             $match: {
    //                 eventDate: { $ne: null }
    //             }
    //         },
    //         {
    //             $match: {
    //                 ...(status === commonConstants.CLIENT_ORDERS_TABLE_TABS.UPCOMING
    //                     ? { eventDate: { $gte: new Date() } }
    //                     : status === commonConstants.CLIENT_ORDERS_TABLE_TABS.COMPLETED
    //                         ? { eventDate: { $lt: new Date() } }
    //                         : {})
    //             }
    //         }
    //     );
    // }

    // // NOTE: Filter by title
    // if (title && title.length > 0) {
    //     pipeline.push({
    //         $match: {
    //             $or: [
    //                 { name: { $regex: `.*${title}.*`, $options: "i" } },
    //                 { id: { $regex: `.*${title}.*`, $options: "i" } }
    //             ]
    //         }
    //     });
    // }

    // NOTE: parallel stages
    pipeline.push(
        {
            $facet: {
                bookingRevenue: [
                    {
                        $group: {
                            _id: null,
                            count: { $sum: "$price" },
                        }
                    },
                ],
                numberOfCancelledBookings: [
                    {
                        $match: {
                            "participant.isEventCancelledByServiceProvider": true
                        }
                    },
                    {$count: "count"}
                ],
                numberOfCompletedBookings: [
                    {
                        $match: {
                            orderDate: { $lt: new Date() } 
                        }
                    },
                    {$count: "count"}
                ],
                report: [ 
                    ...tableRecords,
                    {
                        $skip: skip
                    },
                    {
                        $limit: limit
                    }
                ],
                totalNumberOfRecords: [ 
                    ...tableRecords,
                    {$count: "count"}
                ]

            }
        }
    )

    return pipeline;
};

// NOTE: serivvice pro get owan event calander 
exports.getCalanderPipeline = ({
    startingDate = null, 
    endingDate = null,
    serviceProviderId,
}) => {

    const filterStages = [];
    
    // NOTE: excluding the deleted entries
    filterStages.push(
        { 
            $match: { isDeleted: { $ne: true } } 
        }
    )

    if(serviceProviderId){        
        filterStages.push({
            $match: { organizer : new mongoose.Types.ObjectId(serviceProviderId) }
        })
    }

    filterStages.push({
        $addFields: {
            startDate: {
                $ifNull: ['$date', '$eventStartDate']
            }
        }
    });

    filterStages.push(
        {
            $unwind: {
                path: "$recurringEventsDates",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $addFields: {
                startDate: {
                    $cond: [
                        { $eq: ["$schedulingType", commonConstants.schedulingType.RECURRING] },
                        "$recurringEventsDates.start",
                        { $ifNull: ["$date", "$eventStartDate"] }
                    ]
                },
                endDate: {
                    $cond: [
                        { $eq: ["$schedulingType", commonConstants.schedulingType.RECURRING] },
                        "$recurringEventsDates.end",
                        "$endingTime"
                    ]
                },
            }
        },
        {
            $unset: "recurringEventsDates"
        }
    );

    // Note: filtering complaints based on date range - filtering complaints
    if(startingDate){
        filterStages.push(
            {
                $match: {
                    $expr: {
                        $gte: [
                            { $dateToString: { format: "%Y-%m-%d", date: "$startDate" } },
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
                            { $dateToString: { format: "%Y-%m-%d", date: "$startDate" } },
                            endingDate
                        ]
                    }
                }
            }
        );
    }

    const baseStage = [

        ...filterStages,

    ];
    
    baseStage.push({ $project: { title: "$name", start: "$startDate", end: "$endDate", schedulingType: 1 }})
    
    // NOTE: Sort latest first
    baseStage.push({ $sort: { startDate: 1 } });

    // // NOTE: Pagination
    // if (limit && limit > 0) {
    //     baseStage.push({
    //         $facet: {
    //             paginatedData: [{ $skip: skip }, { $limit: limit }],
    //             metaData: [{ $count: "totalCount" }]
    //         }
    //     });
    // }

    return baseStage;
};

// NOTE: get user object for the signin with populated wishlist with distanceInKM
exports.getUserInSignInWithDistanceWishlist = ({
    email,
    userLongitude = 1,
    userLatitude = 1,
}) => {

    // longitude
    // 80.931076
    // latitude
    // 6.927223
    // const userLongitude = 80.123;
    // const userLatitude = 7.456;

    const pipeline = [
        {
            $match: {
            $or: [
                { email: email.toLowerCase() },
                { phoneNumber: email }
            ]
            }
        },
        { 
            $match: { isDeleted: { $ne: true } } 
        },
        {
            $lookup: {
            from: "events",
            localField: "wishList",
            foreignField: "_id",
            as: "wishList"
            }
        },
        {
            $unwind: {
            path: "$wishList",
            preserveNullAndEmptyArrays: true
            }
        },
        {
            $addFields: {
            eventLocation: { $arrayElemAt: ["$wishList.eventLocations", 0] }
            }
        },
        {
            $addFields: {
            distanceInKm: {
                $let: {
                vars: {
                    lat1: { $arrayElemAt: ["$eventLocation.location.coordinates", 1] },
                    lon1: { $arrayElemAt: ["$eventLocation.location.coordinates", 0] },
                    lat2: userLatitude,
                    lon2: userLongitude
                },
                in: {
                    $divide: [
                    {
                        $multiply: [
                        6371,
                        {
                            $acos: {
                            $add: [
                                {
                                $multiply: [
                                    { $sin: { $degreesToRadians: "$$lat1" } },
                                    { $sin: { $degreesToRadians: "$$lat2" } }
                                ]
                                },
                                {
                                $multiply: [
                                    { $cos: { $degreesToRadians: "$$lat1" } },
                                    { $cos: { $degreesToRadians: "$$lat2" } },
                                    { $cos: {
                                        $subtract: [
                                        { $degreesToRadians: "$$lon2" },
                                        { $degreesToRadians: "$$lon1" }
                                        ]
                                    }
                                    }
                                ]
                                }
                            ]
                            }
                        }
                        ]
                    },
                    1
                    ]
                }
                }
            }
            }
        },
        {
            $group: {
            _id: "$_id",
            doc: { $first: "$$ROOT" },
            wishList: {
                $push: {
                $mergeObjects: ["$wishList", { distanceInKm: "$distanceInKm" }]
                }
            }
            }
        },
        {
            $replaceRoot: {
            newRoot: {
                $mergeObjects: ["$doc", { wishList: "$wishList" }]
            }
            }
        }
    ];

    return pipeline;
}

exports.getServiceProEventMetrics = ({
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

    if(serviceProviderId){        
        filterStages.push({
            $match: { organizer : new mongoose.Types.ObjectId(serviceProviderId) }
        })
    }

    filterStages.push(
        {
            $facet: {

                reviewsMetrics: [
                    {
                        $lookup: {
                            from: "reviews",
                            let: { spId: new mongoose.Types.ObjectId(serviceProviderId) },
                            pipeline: [
                                {
                                    $match: {
                                        $expr: { $eq: ["$eventOrganizer", "$$spId"] }
                                    }
                                },
                                {
                                    $group: {
                                        _id: null,
                                        totalReviews: { $sum: 1 },
                                        avgRating: { $avg: "$rating" }
                                    }
                                },
                                {
                                    $project: {
                                        _id: 0,
                                        totalReviews: 1,
                                        avgRating: 1
                                    }
                                }
                            ],
                            as: "metrics"
                        }
                    },
                    {
                        $unwind: {
                            path: "$metrics",
                            preserveNullAndEmptyArrays: true
                        }
                    },
                    {
                        $match: {
                            metrics: { $ne: null }
                        }
                    },
                    {
                        $replaceRoot: {
                            newRoot: "$metrics"
                        }
                    }
                ],

                completedMetrics: [
                    // NOTE: If not orders, derive startDate from date or eventStartDate
                    {
                        $addFields: {
                            startDate: {
                                $ifNull: ['$date', '$eventStartDate']
                            }
                        }
                    },
                    {
                        $unwind: {
                            path: "$recurringEventsDates",
                            preserveNullAndEmptyArrays: true
                        }
                    },
                    {
                        $addFields: {
                            startDate: {
                                $cond: [
                                    { $eq: ["$schedulingType", commonConstants.schedulingType.RECURRING] },
                                    "$recurringEventsDates.start",
                                    { $ifNull: ["$date", "$eventStartDate"] }
                                ]
                            },
                            endDate: {
                                $cond: [
                                    { $eq: ["$schedulingType", commonConstants.schedulingType.RECURRING] },
                                    "$recurringEventsDates.end",
                                    "$eventEndDate"
                                ]
                            },
                            participants: {
                                $cond: [
                                    { $eq: ["$schedulingType", commonConstants.schedulingType.RECURRING] },
                                    "$recurringEventsDates.participants",
                                    "$participants"
                                ]
                            }
                        }
                    },
                    {
                        $unset: "recurringEventsDates"
                    },
                    {
                        $addFields: {
                            timelineStatus: {
                            $cond: [
                                { $gte: ["$startDate", new Date()] },
                                commonConstants.CLIENT_ORDERS_TABLE_TABS.UPCOMING,
                                commonConstants.CLIENT_ORDERS_TABLE_TABS.COMPLETED
                            ]
                            }
                        }
                    },
                    {
                        $group: {
                            _id: "$timelineStatus", // NOTE: Group by UPCOMING / COMPLETED
                            count: { $sum: 1 }
                        }
                    },
                    {
                        $project: {
                            _id: 0,
                            timelineStatus: "$_id",
                            count: 1
                        }
                    }
                ]
            }
        }
    )

    return filterStages;
};

// NOTE: service provider get wallet information
exports.getServiceProWalletPipeline = ({
    // heroSearchTerm,
    title = null,
    // category = null,
    // payment_status = null,
    status = null,
    subStatus = null,
    // location = null,
    // locationLongitude = null,
    // locationLatitude = null,
    // date = null,
    startingDate = null, 
    endingDate = null,
    // isOrders = false,
    // isComplaints = false,
    // userId,
    userRoles = [],
    serviceProviderId,
    // longitude = null,
    // latitude = null,
    // isNearbyEvents = false,
    limit = 0,
    skip = 0,
}) => {

    const filterStages = [];
    const now = new Date();


    if(serviceProviderId){        
        filterStages.push(
            {
                $match: { organizer : new mongoose.Types.ObjectId(serviceProviderId) }
            }
        )
    }

    // NOTE: excluding the deleted entries
    // filterStages.push(
    //     { 
    //         $match: { isDeleted: { $ne: true } } 
    //     }
    // )

    // NOTE: If not orders, derive startDate from date or eventStartDate
    filterStages.push({
        $addFields: {
            startDate: {
                $ifNull: ['$date', '$eventStartDate']
            }
        }
    });

    if(userRoles?.includes(commonConstants.roles.SERVICE_PRO)){
        filterStages.push(
            {
                $unwind: {
                    path: "$recurringEventsDates",
                    preserveNullAndEmptyArrays: true
                }
            },
            // {
            //     $match: {
            //         $or: [
            //             { schedulingType: commonConstants.schedulingType.ONETIME },
            //             {
            //                 $and: [
            //                     { schedulingType: commonConstants.schedulingType.RECURRING },
            //                     { "recurringEventsDates.participants.user": userObjectId }
            //                 ]
            //             }
            //         ]
            //     }
            // },
            {
                $addFields: {
                    startDate: {
                        $cond: [
                            { $eq: ["$schedulingType", commonConstants.schedulingType.RECURRING] },
                            "$recurringEventsDates.start",
                            { $ifNull: ["$date", "$eventStartDate"] }
                        ]
                    },
                    endDate: {
                        $cond: [
                            { $eq: ["$schedulingType", commonConstants.schedulingType.RECURRING] },
                            "$recurringEventsDates.payoutDate",
                            "$payoutOneTimeDate"
                        ]
                    },
                    payoutStatusTemp: {
                        $cond: [
                            { $eq: ["$schedulingType", commonConstants.schedulingType.RECURRING] },
                            "$recurringEventsDates.payoutStatus",
                            "$payoutStatusOneTime"
                        ]
                    },
                    // participants: {
                    //     $cond: [
                    //         { $eq: ["$schedulingType", commonConstants.schedulingType.RECURRING] },
                    //         "$recurringEventsDates.participants",
                    //         "$participants"
                    //     ]
                    // }
                }
            },
            // {
            //     $unset: "recurringEventsDates"
            // }
        );
    }

    //NOTE: calculating the final amount of the payout
    if (userRoles?.includes(commonConstants.roles.SERVICE_PRO)) {
        filterStages.push({
            $addFields: {
                finalAmountOfPayout: {
                    $cond: [
                        { $eq: ["$schedulingType", commonConstants.schedulingType.RECURRING] },
                        {
                            // NOTE: Case: RECURRING -> use recurringEventsDates.participants
                            $sum: {
                                $map: {
                                    input: {
                                        $filter: {
                                            input: "$recurringEventsDates.participants",
                                            as: "p",
                                            cond: { $eq: ["$$p.paymentStatus", commonConstants.paymentStatus.PAID] }
                                        }
                                    },
                                    as: "paidP",
                                    in: "$$paidP.serviceProviderAmount"
                                }
                            }
                        },
                        {
                            // NOTE: Case: ONETIME -> use root-level participants
                            $sum: {
                                $map: {
                                    input: {
                                        $filter: {
                                            input: "$participants",
                                            as: "p",
                                            cond: { $eq: ["$$p.paymentStatus", commonConstants.paymentStatus.PAID] }
                                        }
                                    },
                                    as: "paidP",
                                    in: "$$paidP.serviceProviderAmount"
                                }
                            }
                        }
                    ]
                }
            }
        });
    }

    // NOTE: taking only the payment status existing records
    filterStages.push(
        {
            $match: {
                $or: [
                    { payoutStatusTemp: commonConstants.payoutStatus.COMPLETED},
                    { payoutStatusTemp: commonConstants.payoutStatus.PENDING },
                    { payoutStatusTemp: commonConstants.payoutStatus.FAILED }
                ]
            }
        }
    )

    // NOTE: Apply upcoming/completed status filtering
    // if (
    //     ((isOrders && status && status.length > 0) || (userRoles?.includes(commonConstants.roles.ADMIN) && status && status.length > 0)) &&
    //     (status && status.length > 0 && status !== commonConstants.CLIENT_ORDERS_TABLE_TABS.ALL)
    // ) {
    //     filterStages.push(
    //         {
    //             $match: {
    //                 startDate: { $ne: null }
    //             }
    //         },
    //         {
    //             $match: {
    //                 ...(status === commonConstants.CLIENT_ORDERS_TABLE_TABS.UPCOMING
    //                     ? { startDate: { $gte: new Date() } }
    //                     : status === commonConstants.CLIENT_ORDERS_TABLE_TABS.COMPLETED
    //                         ? { startDate: { $lt: new Date() } }
    //                         : {})
    //             }
    //         }
    //     );
    // }

    //heroSearchTerm
    // // NOTE: Filter by herso section main search term
    // if (heroSearchTerm && !isComplaints && heroSearchTerm.length > 0 && !userRoles?.includes(commonConstants.roles.ADMIN)) {                
    //     filterStages.push({
    //         $match: {
    //             $or: [
    //                 { name: { $regex: `.*${heroSearchTerm}.*`, $options: "i" } },
    //                 { id: { $regex: `.*${heroSearchTerm}.*`, $options: "i" } },
    //                 { category: { $regex: `.*${heroSearchTerm}.*`, $options: "i" } },
    //                 { description: { $regex: `.*${heroSearchTerm}.*`, $options: "i" } },
    //                 { eventType: { $regex: `.*${heroSearchTerm}.*`, $options: "i" } }
    //             ]
    //         }
    //     });
    // }

    // NOTE: Filter by title
    // if (title && !isComplaints && title.length > 0 && !userRoles?.includes(commonConstants.roles.ADMIN)) {        
    //     filterStages.push({
    //         $match: {
    //             $or: [
    //                 { name: { $regex: `.*${title}.*`, $options: "i" } },
    //                 { id: { $regex: `.*${title}.*`, $options: "i" } }
    //             ]
    //         }
    //     });
    // }

    // NOTE: Filter by category
    // if (category && !isComplaints && category.length > 0) {
    //     filterStages.push({
    //         $match: {
    //             category: { $regex: `.*${category}.*`, $options: "i" }
    //         }
    //     });
    // }

    const staticalPipeline = [
        ...filterStages
    ]

    // Note: filtering complaints based on date range - filtering complaints
    if(startingDate){
        filterStages.push(
            {
                $match: {
                    $expr: {
                        $gte: [
                            { $dateToString: { format: "%Y-%m-%d", date: "$endDate" } },
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
                            { $dateToString: { format: "%Y-%m-%d", date: "$endDate" } },
                            endingDate
                        ]
                    }
                }
            }
        );
    }

    // NOTE: filtering records based on payout status
    if(status && status?.length > 0){
        if(status === commonConstants.SERVICE_PRO_WALLET_TABLE_TABS.PAYOUT_RECEIVED){
            filterStages.push(
                {
                    $match: { payoutStatusTemp: commonConstants.payoutStatus.COMPLETED}
                }
            )
            filterStages.push(
                {
                    $match: {finalAmountOfPayout: { $gt: 0 }}
                }
            )
        }else if(status === commonConstants.SERVICE_PRO_WALLET_TABLE_TABS.RECEIVED){
            filterStages.push(
                {
                    // $match: { payoutStatusTemp: commonConstants.payoutStatus.PENDING}
                    $match: {
                        payoutStatusTemp: {
                            $in: [
                                commonConstants.payoutStatus.PENDING,
                                commonConstants.payoutStatus.FAILED
                            ]
                        }
                    }
                }
            )
            
        }
    }

    const baseStage = [

        ...filterStages,

        // NOTE: adding the aditional field to track the completed or upcoming event status
        // {
        //     $match: {
        //         startDate: { $ne: null }
        //     }
        // },

        // {
        //     $addFields: {
        //         timelineStatus: {
        //         $cond: [
        //             { $gte: ["$startDate", new Date()] },
        //             commonConstants.CLIENT_ORDERS_TABLE_TABS.UPCOMING,
        //             commonConstants.CLIENT_ORDERS_TABLE_TABS.COMPLETED
        //         ]
        //         }
        //     }
        // }
    ];

    baseStage.push(
        {
            $addFields: {
                timelineStatus: {
                $cond: [
                    { $gte: ["$startDate", new Date()] },
                    commonConstants.CLIENT_ORDERS_TABLE_TABS.UPCOMING,
                    commonConstants.CLIENT_ORDERS_TABLE_TABS.COMPLETED
                ]
                }
            }
        }
    )

    // if(!isComplaints){
    baseStage.push(
        // NOTE: Populate organizer
        {
            $lookup: {
                from: 'serviceproviders',
                localField: 'organizer',
                foreignField: '_id',
                as: 'organizer'
            }
        },
        {
            $unwind: {
                path: '$organizer',
                preserveNullAndEmptyArrays: true
            }
        },
    )
    // }

    // NOTE : filter order by organizer name or business name  
    if(title && userRoles?.includes(commonConstants.roles.SERVICE_PRO)){
        // NOTE: concating both user first name and last name -> then save within new temp field
        baseStage.push(
            {
                $addFields: {
                    fullNameOrganizer: { $concat: ["$organizer.firstName", " ", "$organizer.lastName"] },
                }
            }
        )

        // NOTE: Case-insensitive partial match for business name
        baseStage.push(
            {
                $match: {
                    $or: [
                        {fullNameOrganizer: { $regex: title, $options: "i" } },
                        {"organizer.businessInformation.name": { $regex: title, $options: "i" } },
                        // {id: { $regex: title, $options: "i" } },
                        // {name: { $regex: title, $options: "i" } },
                    ]
                }
            }
        )
    }

    // NOTE: Sort closest first for clients :::  latest first for admins, service providers   
    baseStage.push({ $sort: { createdAt: -1 } });
    
    // NOTE: Pagination
    // if (limit && limit > 0) {
    //     baseStage.push({
    //         $facet: {
    //             paginatedData: [{ $skip: skip }, { $limit: limit }],
    //             metaData: [{ $count: "totalCount" }]
    //         }
    //     });
    // }

    // return baseStage;

    const finalCompleted = [
        {
            $facet : {
                // completedPayouts: [
                //     ...staticalPipeline,
                //     {
                //         $match: { payoutStatusTemp: commonConstants.payoutStatus.COMPLETED}
                //     },
                //     {$count: "count"}
                // ],
                // pendingPayouts: [
                //     ...staticalPipeline,
                //     {
                //         $match: { payoutStatusTemp: commonConstants.payoutStatus.PENDING}
                //     },
                //     {$count: "count"}
                // ],
                report: [ 
                    ...baseStage,
                    {
                        $skip: skip
                    },
                    {
                        $limit: limit
                    }
                ],
                totalNumberOfRecords: [ 
                    ...baseStage,
                    {$count: "count"}
                ],
            }
        },
    ]

    const finalPending = [
        {
            $facet : {
                // completedPayouts: [
                //     ...staticalPipeline,
                //     {
                //         $match: { payoutStatusTemp: commonConstants.payoutStatus.COMPLETED}
                //     },
                //     {$count: "count"}
                // ],
                // pendingPayouts: [
                //     ...staticalPipeline,
                //     {
                //         $match: { payoutStatusTemp: commonConstants.payoutStatus.PENDING}
                //     },
                //     {$count: "count"}
                // ],
                // report: [ 
                //     ...baseStage,
                //     {
                //         $skip: skip
                //     },
                //     {
                //         $limit: limit
                //     }
                // ],
                // totalNumberOfRecords: [ 
                //     ...baseStage,
                //     {$count: "count"}
                // ],
                onetime: [
                    ...baseStage,
                    {
                        $match: { schedulingType: commonConstants.schedulingType.ONETIME }
                    },
                    ...(((subStatus !== commonConstants.SERVICE_PRO_WALLET_TABLE_TABS.IN_PROGRESS_PAYOUT) && (status === commonConstants.SERVICE_PRO_WALLET_TABLE_TABS.RECEIVED)) ?
                        [
                            {
                                $match: {
                                    $expr: {
                                        $or: [
                                            // ONETIME branch
                                            {
                                                $and: [
                                                    { $gte: ["$eventEndDate", now] }
                                                ]
                                            },
                                        ]
                                    }
                                }
                            },
                        ] : 
                        []
                    ),
                    ...(((subStatus === commonConstants.SERVICE_PRO_WALLET_TABLE_TABS.IN_PROGRESS_PAYOUT) && (status === commonConstants.SERVICE_PRO_WALLET_TABLE_TABS.RECEIVED)) ?
                        [
                            {
                                $match: {
                                    $expr: {
                                        $or: [
                                            // ONETIME branch
                                            {
                                                $and: [
                                                    { $eq: ["$schedulingType", commonConstants.schedulingType.ONETIME] },
                                                    { $ne: ["$payoutStatusOneTime", commonConstants.payoutStatus.COMPLETED] },
                                                    { $lt: ["$eventEndDate", now] }
                                                ]
                                            },
                                        ]
                                    }
                                }
                            },
                        ] :
                        []
                    ),
                    {
                        $unwind: {
                            path: '$participants',
                            preserveNullAndEmptyArrays: false
                        }
                    },
                    {
                        $addFields: {
                            orderDate: "$participants.date",
                            participant: "$participants"
                        }
                    },
                    {
                        $replaceRoot: {
                            newRoot: {
                                name: "$name",
                                eventLocations: "$eventLocations",
                                price: "$price",
                                id: "$id",
                                eventId: "$_id",
                                schedulingType: "$schedulingType",
                                eventDate: "$date",
                                orderDate: "$orderDate",
                                participant: "$participant",
                                organizer: "$organizer",
                                payoutStatusTemp: "$payoutStatusTemp",
                            }
                        }
                    }
                ],
                recurring: [
                    ...baseStage,
                    {
                        $match: { schedulingType: commonConstants.schedulingType.RECURRING }
                    },
                    // {
                    //     $unwind: "$recurringEventsDates"
                    // },
                    {
                        $unwind: {
                            path: "$recurringEventsDates.participants",
                            preserveNullAndEmptyArrays: false
                        }
                    },
                    {
                        $addFields: {
                            eventDate: "$recurringEventsDates.start",
                            recEventEndDate: "$recurringEventsDates.end",
                            recEventPayoutStatus: "$recurringEventsDates.payoutStatus",
                            participant: "$recurringEventsDates.participants"
                        }
                    },
                    ...(((subStatus !== commonConstants.SERVICE_PRO_WALLET_TABLE_TABS.IN_PROGRESS_PAYOUT) && (status === commonConstants.SERVICE_PRO_WALLET_TABLE_TABS.RECEIVED)) ?
                        [
                            {
                                $match: {
                                    $expr: {
                                        $or: [
                                            // recurring branch
                                            {
                                                $and: [
                                                    { $gte: ["$recEventEndDate", now] }
                                                ]
                                            },
                                        ]
                                    }
                                }
                            },
                        ] : 
                        []
                    ),
                    ...(((subStatus === commonConstants.SERVICE_PRO_WALLET_TABLE_TABS.IN_PROGRESS_PAYOUT) && (status === commonConstants.SERVICE_PRO_WALLET_TABLE_TABS.RECEIVED)) ? 
                        [
                            {
                                $match: {
                                    $expr: {
                                        $or: [
                                            // ONETIME branch
                                            {
                                                $and: [
                                                    { $eq: ["$schedulingType", commonConstants.schedulingType.RECURRING] },
                                                    { $ne: ["$recEventPayoutStatus", commonConstants.payoutStatus.COMPLETED] },
                                                    { $lt: ["$recEventEndDate", now] }
                                                ]
                                            },

                                            // RECURRING branch: at least one recurringEventsDates element matches
                                            // {
                                            //     $and: [
                                            //         { $eq: ["$schedulingType", commonConstants.schedulingType.RECURRING] },
                                            //         {
                                            //             $gt: [
                                            //                 {
                                            //                     $size: {
                                            //                         $filter: {
                                            //                             input: { $ifNull: ["$recurringEventsDates", []] },
                                            //                             as: "d",
                                            //                             cond: {
                                            //                                 $and: [
                                            //                                     { $ne: ["$$d.payoutStatus", commonConstants.payoutStatus.COMPLETED] },
                                            //                                     { $lt: ["$$d.end", now] }
                                            //                                 ]
                                            //                             }
                                            //                         }
                                            //                     }
                                            //                 },
                                            //                 0
                                            //             ]
                                            //         }
                                            //     ]
                                            // }
                                        ]
                                    }
                                }
                            },
                        ] : 
                        []
                    ),
                    {
                        $replaceRoot: {
                            newRoot: {
                                name: "$name",
                                eventLocations: "$eventLocations",
                                price: "$price",
                                id: "$id",
                                eventId: "$_id",
                                schedulingType: "$schedulingType",
                                eventDate: "$eventDate",
                                recEventEndDate: "$recEventEndDate",
                                orderDate: "$participant.date",
                                participant: "$participant",
                                payoutStatusTemp: "$payoutStatusTemp",
                                recurringEventsDates: "$recurringEventsDates",
                            }
                        }
                    }
                ]
            }
        },
        // NOTE: Merge onetime + recurring
        {
            $project: {
                attendees: { $concatArrays: ["$onetime", "$recurring"] }
            }
        },

        { $unwind: "$attendees" },
        { $replaceRoot: { newRoot: "$attendees" } },
        // { $match: { "participant.paymentStatus": commonConstants.paymentStatus.PAID }},
        
        // NOTE: Populate user
        {
            $lookup: {
                from: "users",
                localField: "participant.user",
                foreignField: "_id",
                as: "participant.user"
            }
        },
        {
            $unwind: {
                path: "$user",
                preserveNullAndEmptyArrays: true
            }
        },

        { $sort: { "participant.date": -1}},

        {
            $facet: {
                paginatedData: [{ $skip: skip }, { $limit: limit }],
                metaData: [{ $count: "totalCount" }]
            }
        }
    ]

    return status === commonConstants.SERVICE_PRO_WALLET_TABLE_TABS.PAYOUT_RECEIVED ?  finalCompleted : finalPending;
};

// NOTE: service provider get wallet information
exports.getServiceProWalletMetricsPipeline = ({
    title = null,
    status = null,
    startingDate = null, 
    endingDate = null,
    userRoles = [],
    serviceProviderId,
    limit = 0,
    skip = 0,
}) => {
    const filterStages = [];    

    if(serviceProviderId){        
        filterStages.push(
            {
                $match: { organizer : new mongoose.Types.ObjectId(serviceProviderId) }
            }
        )
    }

    // NOTE: excluding the deleted entries
    // filterStages.push(
    //     { 
    //         $match: { isDeleted: { $ne: true } } 
    //     }
    // )

    // NOTE: If not orders, derive startDate from date or eventStartDate
    filterStages.push({
        $addFields: {
            startDate: {
                $ifNull: ['$date', '$eventStartDate']
            }
        }
    });

    if(userRoles?.includes(commonConstants.roles.SERVICE_PRO)){
        filterStages.push(
            {
                $unwind: {
                    path: "$recurringEventsDates",
                    preserveNullAndEmptyArrays: true
                }
            },
            // {
            //     $match: {
            //         $or: [
            //             { schedulingType: commonConstants.schedulingType.ONETIME },
            //             {
            //                 $and: [
            //                     { schedulingType: commonConstants.schedulingType.RECURRING },
            //                     { "recurringEventsDates.participants.user": userObjectId }
            //                 ]
            //             }
            //         ]
            //     }
            // },
            {
                $addFields: {
                    startDate: {
                        $cond: [
                            { $eq: ["$schedulingType", commonConstants.schedulingType.RECURRING] },
                            "$recurringEventsDates.start",
                            { $ifNull: ["$date", "$eventStartDate"] }
                        ]
                    },
                    endDate: {
                        $cond: [
                            { $eq: ["$schedulingType", commonConstants.schedulingType.RECURRING] },
                            "$recurringEventsDates.payoutDate",
                            "$payoutOneTimeDate"
                        ]
                    },
                    payoutStatusTemp: {
                        $cond: [
                            { $eq: ["$schedulingType", commonConstants.schedulingType.RECURRING] },
                            "$recurringEventsDates.payoutStatus",
                            "$payoutStatusOneTime"
                        ]
                    },
                    // participants: {
                    //     $cond: [
                    //         { $eq: ["$schedulingType", commonConstants.schedulingType.RECURRING] },
                    //         "$recurringEventsDates.participants",
                    //         "$participants"
                    //     ]
                    // }
                }
            },
            // {
            //     $unset: "recurringEventsDates"
            // }
        );
    }

    //NOTE: calculating the final amount of the payout
    // if (userRoles?.includes(commonConstants.roles.SERVICE_PRO)) {
    //     filterStages.push({
    //         $addFields: {
    //             finalAmountOfPayout: {
    //                 $cond: [
    //                     { $eq: ["$schedulingType", commonConstants.schedulingType.RECURRING] },
    //                     {
    //                         // NOTE: Case: RECURRING -> use recurringEventsDates.participants
    //                         $sum: {
    //                             $map: {
    //                                 input: {
    //                                     $filter: {
    //                                         input: "$recurringEventsDates.participants",
    //                                         as: "p",
    //                                         cond: { $eq: ["$$p.paymentStatus", commonConstants.paymentStatus.PAID] }
    //                                     }
    //                                 },
    //                                 as: "paidP",
    //                                 in: "$$paidP.serviceProviderAmount"
    //                             }
    //                         }
    //                     },
    //                     {
    //                         // NOTE: Case: ONETIME -> use root-level participants
    //                         $sum: {
    //                             $map: {
    //                                 input: {
    //                                     $filter: {
    //                                         input: "$participants",
    //                                         as: "p",
    //                                         cond: { $eq: ["$$p.paymentStatus", commonConstants.paymentStatus.PAID] }
    //                                     }
    //                                 },
    //                                 as: "paidP",
    //                                 in: "$$paidP.serviceProviderAmount"
    //                             }
    //                         }
    //                     }
    //                 ]
    //             }
    //         }
    //     });
    // }

    // NOTE: taking only the payment status existing records
    filterStages.push(
        {
            $match: {
                $or: [
                    { payoutStatusTemp: commonConstants.payoutStatus.COMPLETED},
                    { payoutStatusTemp: commonConstants.payoutStatus.PENDING },
                    { payoutStatusTemp: commonConstants.payoutStatus.FAILED }
                ]
            }
        }
    )

    // NOTE: Apply upcoming/completed status filtering
    // if (
    //     ((isOrders && status && status.length > 0) || (userRoles?.includes(commonConstants.roles.ADMIN) && status && status.length > 0)) &&
    //     (status && status.length > 0 && status !== commonConstants.CLIENT_ORDERS_TABLE_TABS.ALL)
    // ) {
    //     filterStages.push(
    //         {
    //             $match: {
    //                 startDate: { $ne: null }
    //             }
    //         },
    //         {
    //             $match: {
    //                 ...(status === commonConstants.CLIENT_ORDERS_TABLE_TABS.UPCOMING
    //                     ? { startDate: { $gte: new Date() } }
    //                     : status === commonConstants.CLIENT_ORDERS_TABLE_TABS.COMPLETED
    //                         ? { startDate: { $lt: new Date() } }
    //                         : {})
    //             }
    //         }
    //     );
    // }

    //heroSearchTerm
    // // NOTE: Filter by herso section main search term
    // if (heroSearchTerm && !isComplaints && heroSearchTerm.length > 0 && !userRoles?.includes(commonConstants.roles.ADMIN)) {                
    //     filterStages.push({
    //         $match: {
    //             $or: [
    //                 { name: { $regex: `.*${heroSearchTerm}.*`, $options: "i" } },
    //                 { id: { $regex: `.*${heroSearchTerm}.*`, $options: "i" } },
    //                 { category: { $regex: `.*${heroSearchTerm}.*`, $options: "i" } },
    //                 { description: { $regex: `.*${heroSearchTerm}.*`, $options: "i" } },
    //                 { eventType: { $regex: `.*${heroSearchTerm}.*`, $options: "i" } }
    //             ]
    //         }
    //     });
    // }

    // NOTE: Filter by title
    // if (title && !isComplaints && title.length > 0 && !userRoles?.includes(commonConstants.roles.ADMIN)) {        
    //     filterStages.push({
    //         $match: {
    //             $or: [
    //                 { name: { $regex: `.*${title}.*`, $options: "i" } },
    //                 { id: { $regex: `.*${title}.*`, $options: "i" } }
    //             ]
    //         }
    //     });
    // }

    // NOTE: Filter by category
    // if (category && !isComplaints && category.length > 0) {
    //     filterStages.push({
    //         $match: {
    //             category: { $regex: `.*${category}.*`, $options: "i" }
    //         }
    //     });
    // }

    // const staticalPipeline = [
    //     ...filterStages
    // ]

    // NOTE: filtering records based on payout status
    // if(status && status?.length > 0){
    //     if(status === commonConstants.SERVICE_PRO_WALLET_TABLE_TABS.PAYOUT_RECEIVED){
    //         filterStages.push(
    //             {
    //                 $match: { payoutStatusTemp: commonConstants.payoutStatus.COMPLETED}
    //             }
    //         )
    //         filterStages.push(
    //             {
    //                 $match: {finalAmountOfPayout: { $gt: 0 }}
    //             }
    //         )
    //     }else if(status === commonConstants.SERVICE_PRO_WALLET_TABLE_TABS.RECEIVED){
    //         filterStages.push(
    //             {
    //                 $match: { payoutStatusTemp: commonConstants.payoutStatus.PENDING}
    //             }
    //         )
            
    //     }
    // }

    const baseStage = [

        ...filterStages,

        // NOTE: adding the aditional field to track the completed or upcoming event status
        // {
        //     $match: {
        //         startDate: { $ne: null }
        //     }
        // },

        // {
        //     $addFields: {
        //         timelineStatus: {
        //         $cond: [
        //             { $gte: ["$startDate", new Date()] },
        //             commonConstants.CLIENT_ORDERS_TABLE_TABS.UPCOMING,
        //             commonConstants.CLIENT_ORDERS_TABLE_TABS.COMPLETED
        //         ]
        //         }
        //     }
        // }
    ];

    baseStage.push(
        {
            $addFields: {
                timelineStatus: {
                $cond: [
                    { $gte: ["$startDate", new Date()] },
                    commonConstants.CLIENT_ORDERS_TABLE_TABS.UPCOMING,
                    commonConstants.CLIENT_ORDERS_TABLE_TABS.COMPLETED
                ]
                }
            }
        }
    )

    // if(!isComplaints){
    // baseStage.push(
    //     // NOTE: Populate organizer
    //     {
    //         $lookup: {
    //             from: 'serviceproviders',
    //             localField: 'organizer',
    //             foreignField: '_id',
    //             as: 'organizer'
    //         }
    //     },
    //     {
    //         $unwind: {
    //             path: '$organizer',
    //             preserveNullAndEmptyArrays: true
    //         }
    //     },
    // )
    // }

    // NOTE : filter order by organizer name or business name  
    // if(title && userRoles?.includes(commonConstants.roles.SERVICE_PRO)){
    //     // NOTE: concating both user first name and last name -> then save within new temp field
    //     baseStage.push(
    //         {
    //             $addFields: {
    //                 fullNameOrganizer: { $concat: ["$organizer.firstName", " ", "$organizer.lastName"] },
    //             }
    //         }
    //     )

    //     // NOTE: Case-insensitive partial match for business name
    //     baseStage.push(
    //         {
    //             $match: {
    //                 $or: [
    //                     {fullNameOrganizer: { $regex: title, $options: "i" } },
    //                     {"organizer.businessInformation.name": { $regex: title, $options: "i" } },
    //                     // {id: { $regex: title, $options: "i" } },
    //                     // {name: { $regex: title, $options: "i" } },
    //                 ]
    //             }
    //         }
    //     )
    // }

    // NOTE: Sort closest first for clients :::  latest first for admins, service providers   
    // baseStage.push({ $sort: { createdAt: -1 } });
    
    // NOTE: Pagination
    // if (limit && limit > 0) {
    //     baseStage.push({
    //         $facet: {
    //             paginatedData: [{ $skip: skip }, { $limit: limit }],
    //             metaData: [{ $count: "totalCount" }]
    //         }
    //     });
    // }

    // return baseStage;

    const finalCompleted = [
        {
            $facet : {
                completedPayouts: [
                    // ...staticalPipeline,
                    {
                        $match: { payoutStatusTemp: commonConstants.payoutStatus.COMPLETED}
                    },
                    {$count: "count"}
                ],
                pendingPayouts: [
                    // ...staticalPipeline,
                    {
                        $match: { payoutStatusTemp: commonConstants.payoutStatus.PENDING}
                    },
                    {$count: "count"}
                ],
                report: [ 
                    ...baseStage,
                    {
                        $skip: skip
                    },
                    {
                        $limit: limit
                    }
                ],
                totalNumberOfRecords: [ 
                    ...baseStage,
                    {$count: "count"}
                ],
            }
        },
    ]

    const finalPending = [
        {
            $facet : {
                // completedPayouts: [
                //     ...staticalPipeline,
                //     {
                //         $match: { payoutStatusTemp: commonConstants.payoutStatus.COMPLETED}
                //     },
                //     {$count: "count"}
                // ],
                // pendingPayouts: [
                //     ...staticalPipeline,
                //     {
                //         $match: { payoutStatusTemp: commonConstants.payoutStatus.PENDING}
                //     },
                //     {$count: "count"}
                // ],
                // report: [ 
                //     ...baseStage,
                //     {
                //         $skip: skip
                //     },
                //     {
                //         $limit: limit
                //     }
                // ],
                // totalNumberOfRecords: [ 
                //     ...baseStage,
                //     {$count: "count"}
                // ],
                onetime: [
                    ...baseStage,
                    {
                        $match: { schedulingType: commonConstants.schedulingType.ONETIME }
                    },
                    {
                        $unwind: {
                            path: '$participants',
                            preserveNullAndEmptyArrays: false
                        }
                    },
                    {
                        $addFields: {
                            orderDate: "$participants.date",
                            participant: "$participants"
                        }
                    },
                    {
                        $replaceRoot: {
                            newRoot: {
                                name: "$name",
                                eventLocations: "$eventLocations",
                                price: "$price",
                                id: "$id",
                                eventId: "$_id",
                                schedulingType: "$schedulingType",
                                eventDate: "$date",
                                orderDate: "$orderDate",
                                participant: "$participant",
                                organizer: "$organizer"
                            }
                        }
                    }
                ],
                recurring: [
                    {
                        $match: { schedulingType: commonConstants.schedulingType.RECURRING }
                    },
                    {
                        $unwind: "$recurringEventsDates"
                    },
                    {
                        $unwind: {
                            path: "$recurringEventsDates.participants",
                            preserveNullAndEmptyArrays: false
                        }
                    },
                    {
                        $addFields: {
                            eventDate: "$recurringEventsDates.start",
                            participant: "$recurringEventsDates.participants"
                        }
                    },
                    {
                        $replaceRoot: {
                            newRoot: {
                                name: "$name",
                                eventLocations: "$eventLocations",
                                price: "$price",
                                id: "$id",
                                eventId: "$_id",
                                schedulingType: "$schedulingType",
                                eventDate: "$eventDate",
                                orderDate: "$participant.date",
                                participant: "$participant"
                            }
                        }
                    }
                ]
            }
        },
        // NOTE: Merge onetime + recurring
        {
            $project: {
                attendees: { $concatArrays: ["$onetime", "$recurring"] }
            }
        },

        { $unwind: "$attendees" },
        { $replaceRoot: { newRoot: "$attendees" } },
        // { $match: { "participant.paymentStatus": commonConstants.paymentStatus.PAID }},
        
        // NOTE: Populate user
        {
            $lookup: {
                from: "users",
                localField: "participant.user",
                foreignField: "_id",
                as: "participant.user"
            }
        },
        {
            $unwind: {
                path: "$user",
                preserveNullAndEmptyArrays: true
            }
        },

        { $sort: { "participant.date": -1}},

        {
            $facet: {
                paginatedData: [{ $skip: skip }, { $limit: limit }],
                metaData: [{ $count: "totalCount" }]
            }
        }
    ]

    baseStage.push(
        {
            $facet : {
                // completedPayouts: [
                //     ...staticalPipeline,
                //     {
                //         $match: { payoutStatusTemp: commonConstants.payoutStatus.COMPLETED}
                //     },
                //     {$count: "count"}
                // ],
                // pendingPayouts: [
                //     ...staticalPipeline,
                //     {
                //         $match: { payoutStatusTemp: commonConstants.payoutStatus.PENDING}
                //     },
                //     {$count: "count"}
                // ],
                // report: [ 
                //     ...baseStage,
                //     {
                //         $skip: skip
                //     },
                //     {
                //         $limit: limit
                //     }
                // ],
                // totalNumberOfRecords: [ 
                //     ...baseStage,
                //     {$count: "count"}
                // ],
                onetime: [
                    // ...baseStage,
                    {
                        $match: { schedulingType: commonConstants.schedulingType.ONETIME }
                    },
                    {
                        $unwind: {
                            path: '$participants',
                            preserveNullAndEmptyArrays: false
                        }
                    },
                    {
                        $addFields: {
                            orderDate: "$participants.date",
                            participant: "$participants"
                        }
                    },
                    {
                        $replaceRoot: {
                            newRoot: {
                                name: "$name",
                                eventLocations: "$eventLocations",
                                price: "$price",
                                id: "$id",
                                eventId: "$_id",
                                schedulingType: "$schedulingType",
                                eventDate: "$date",
                                orderDate: "$orderDate",
                                participant: "$participant",
                                organizer: "$organizer",
                                payoutStatusTemp: "$payoutStatusTemp",
                            }
                        }
                    }
                ],
                recurring: [
                    {
                        $match: { schedulingType: commonConstants.schedulingType.RECURRING }
                    },
                    // {
                    //     $unwind: "$recurringEventsDates"
                    // },
                    {
                        $unwind: {
                            path: "$recurringEventsDates.participants",
                            preserveNullAndEmptyArrays: false
                        }
                    },
                    {
                        $addFields: {
                            eventDate: "$recurringEventsDates.start",
                            participant: "$recurringEventsDates.participants"
                        }
                    },
                    {
                        $replaceRoot: {
                            newRoot: {
                                name: "$name",
                                eventLocations: "$eventLocations",
                                price: "$price",
                                id: "$id",
                                eventId: "$_id",
                                schedulingType: "$schedulingType",
                                eventDate: "$eventDate",
                                orderDate: "$participant.date",
                                participant: "$participant",
                                payoutStatusTemp: "$payoutStatusTemp",
                            }
                        }
                    }
                ]
            }
        },
        // NOTE: Merge onetime + recurring
        {
            $project: {
                attendees: { $concatArrays: ["$onetime", "$recurring"] }
            }
        },

        { $unwind: "$attendees" },
        { $replaceRoot: { newRoot: "$attendees" } },
        // { $match: { "participant.paymentStatus": commonConstants.paymentStatus.PAID }},
        
        // NOTE: Populate user
        // {
        //     $lookup: {
        //         from: "users",
        //         localField: "participant.user",
        //         foreignField: "_id",
        //         as: "participant.user"
        //     }
        // },
        // {
        //     $unwind: {
        //         path: "$user",
        //         preserveNullAndEmptyArrays: true
        //     }
        // },

        // { $sort: { "participant.date": -1}},

        // {
        //     $facet: {
        //         paginatedData: [{ $skip: skip }, { $limit: limit }],
        //         metaData: [{ $count: "totalCount" }]
        //     }
        // }
    )

    baseStage.push(
        {
            $facet: {
                totalEarnings: [
                    {
                        $group: {
                            _id: null,
                            amount: { $sum: "$participant.serviceProviderAmount" },
                        }
                    },
                ],
                totalClearedEarnings: [
                    {
                        $match: { payoutStatusTemp: commonConstants.payoutStatus.COMPLETED}
                    },
                    {
                        $group: {
                            _id: null,
                            amount: { $sum: "$participant.serviceProviderAmount" },
                        }
                    },
                ],
                totalOngoingEarnings: [
                    {
                        $match: { payoutStatusTemp: commonConstants.payoutStatus.PENDING}
                    },
                    {
                        $group: {
                            _id: null,
                            amount: { $sum: "$participant.serviceProviderAmount" },
                        }
                    },
                ]
            }
        }
    )

    return baseStage;
};

// NOTE: get all events, client their booked events 
exports.getAllPayoutsPipeline = ({
    // heroSearchTerm,
    title = null,
    category = null,
    // payment_status = null,
    // status = null,
    // location = null,
    // locationLongitude = null,
    // locationLatitude = null,
    // date = null,
    startingDate = null, 
    endingDate = null,
    // isOrders = false,
    // isComplaints = false,
    // userId,
    userRoles = [],
    // serviceProviderId,
    // longitude = null,
    // latitude = null,
    // isNearbyEvents = false,
    limit = 0,
    skip = 0,
}) => {

    const filterStages = [];        

    // NOTE: excluding the deleted entries
    // filterStages.push(
    //     { 
    //         $match: { isDeleted: { $ne: true } } 
    //     }
    // )
    // NOTE: If not orders, derive startDate from date or eventStartDate
    filterStages.push({
        $addFields: {
            startDate: {
                $ifNull: ['$date', '$eventStartDate']
            }
        }
    });

    if(userRoles?.includes(commonConstants.roles.ADMIN)){
        filterStages.push(
            {
                $unwind: {
                    path: "$recurringEventsDates",
                    preserveNullAndEmptyArrays: true
                }
            },
            // {
            //     $match: {
            //         $or: [
            //             { schedulingType: commonConstants.schedulingType.ONETIME },
            //             {
            //                 $and: [
            //                     { schedulingType: commonConstants.schedulingType.RECURRING },
            //                     { "recurringEventsDates.participants.user": userObjectId }
            //                 ]
            //             }
            //         ]
            //     }
            // },
            {
                $addFields: {
                    startDate: {
                        $cond: [
                            { $eq: ["$schedulingType", commonConstants.schedulingType.RECURRING] },
                            "$recurringEventsDates.start",
                            { $ifNull: ["$date", "$eventStartDate"] }
                        ]
                    },
                    endDate: {
                        $cond: [
                            { $eq: ["$schedulingType", commonConstants.schedulingType.RECURRING] },
                            "$recurringEventsDates.payoutDate",
                            "$payoutOneTimeDate"
                        ]
                    },
                    payoutStatusTemp: {
                        $cond: [
                            { $eq: ["$schedulingType", commonConstants.schedulingType.RECURRING] },
                            "$recurringEventsDates.payoutStatus",
                            "$payoutStatusOneTime"
                        ]
                    },
                    // participants: {
                    //     $cond: [
                    //         { $eq: ["$schedulingType", commonConstants.schedulingType.RECURRING] },
                    //         "$recurringEventsDates.participants",
                    //         "$participants"
                    //     ]
                    // }
                }
            },
            // {
            //     $unset: "recurringEventsDates"
            // }
        );
    }

    //NOTE: calculating the final amount of the payout
    if (userRoles?.includes(commonConstants.roles.ADMIN)) {
        filterStages.push({
            $addFields: {
                finalAmountOfPayout: {
                    $cond: [
                        { $eq: ["$schedulingType", commonConstants.schedulingType.RECURRING] },
                        {
                            // NOTE: Case: RECURRING -> use recurringEventsDates.participants
                            $sum: {
                                $map: {
                                    input: {
                                        $filter: {
                                            input: "$recurringEventsDates.participants",
                                            as: "p",
                                            cond: { $eq: ["$$p.paymentStatus", commonConstants.paymentStatus.PAID] }
                                        }
                                    },
                                    as: "paidP",
                                    in: "$$paidP.serviceProviderAmount"
                                }
                            }
                        },
                        {
                            // NOTE: Case: ONETIME -> use root-level participants
                            $sum: {
                                $map: {
                                    input: {
                                        $filter: {
                                            input: "$participants",
                                            as: "p",
                                            cond: { $eq: ["$$p.paymentStatus", commonConstants.paymentStatus.PAID] }
                                        }
                                    },
                                    as: "paidP",
                                    in: "$$paidP.serviceProviderAmount"
                                }
                            }
                        }
                    ]
                }
            }
        });
        filterStages.push(
            {
                $match: {
                    finalAmountOfPayout: { $gt: 0 }
                }
            }
        );
    }


    // NOTE: taking only the payment status existing records
    filterStages.push(
        {
            $match: {
                $or: [
                    { payoutStatusTemp: commonConstants.payoutStatus.COMPLETED},
                    { payoutStatusTemp: commonConstants.payoutStatus.PENDING },
                    { payoutStatusTemp: commonConstants.payoutStatus.FAILED }
                ]
            }
        }
    )

    // NOTE: Apply upcoming/completed status filtering
    // if (
    //     ((isOrders && status && status.length > 0) || (userRoles?.includes(commonConstants.roles.ADMIN) && status && status.length > 0)) &&
    //     (status && status.length > 0 && status !== commonConstants.CLIENT_ORDERS_TABLE_TABS.ALL)
    // ) {
    //     filterStages.push(
    //         {
    //             $match: {
    //                 startDate: { $ne: null }
    //             }
    //         },
    //         {
    //             $match: {
    //                 ...(status === commonConstants.CLIENT_ORDERS_TABLE_TABS.UPCOMING
    //                     ? { startDate: { $gte: new Date() } }
    //                     : status === commonConstants.CLIENT_ORDERS_TABLE_TABS.COMPLETED
    //                         ? { startDate: { $lt: new Date() } }
    //                         : {})
    //             }
    //         }
    //     );
    // }

    //heroSearchTerm
    // // NOTE: Filter by herso section main search term
    // if (heroSearchTerm && !isComplaints && heroSearchTerm.length > 0 && !userRoles?.includes(commonConstants.roles.ADMIN)) {                
    //     filterStages.push({
    //         $match: {
    //             $or: [
    //                 { name: { $regex: `.*${heroSearchTerm}.*`, $options: "i" } },
    //                 { id: { $regex: `.*${heroSearchTerm}.*`, $options: "i" } },
    //                 { category: { $regex: `.*${heroSearchTerm}.*`, $options: "i" } },
    //                 { description: { $regex: `.*${heroSearchTerm}.*`, $options: "i" } },
    //                 { eventType: { $regex: `.*${heroSearchTerm}.*`, $options: "i" } }
    //             ]
    //         }
    //     });
    // }

    // NOTE: Filter by title
    // if (title && !isComplaints && title.length > 0 && !userRoles?.includes(commonConstants.roles.ADMIN)) {        
    //     filterStages.push({
    //         $match: {
    //             $or: [
    //                 { name: { $regex: `.*${title}.*`, $options: "i" } },
    //                 { id: { $regex: `.*${title}.*`, $options: "i" } }
    //             ]
    //         }
    //     });
    // }

    // NOTE: Filter by category
    // if (category && !isComplaints && category.length > 0) {
    //     filterStages.push({
    //         $match: {
    //             category: { $regex: `.*${category}.*`, $options: "i" }
    //         }
    //     });
    // }

    const staticalPipeline = [
        ...filterStages
    ]

    // Note: filtering complaints based on date range - filtering complaints
    if(startingDate){
        filterStages.push(
            {
                $match: {
                    $expr: {
                        $gte: [
                            { $dateToString: { format: "%Y-%m-%d", date: "$endDate" } },
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
                            { $dateToString: { format: "%Y-%m-%d", date: "$endDate" } },
                            endingDate
                        ]
                    }
                }
            }
        );
    }

    // NOTE: filtering records based on payout status : in progress payouts


    // NOTE: filtering records based on payout status
    if(category && category?.length > 0){
        filterStages.push(
            {
                $match: { payoutStatusTemp: category}
            }
        )
    }

    const baseStage = [

        ...filterStages,

        // NOTE: adding the aditional field to track the completed or upcoming event status
        // {
        //     $match: {
        //         startDate: { $ne: null }
        //     }
        // },

        // {
        //     $addFields: {
        //         timelineStatus: {
        //         $cond: [
        //             { $gte: ["$startDate", new Date()] },
        //             commonConstants.CLIENT_ORDERS_TABLE_TABS.UPCOMING,
        //             commonConstants.CLIENT_ORDERS_TABLE_TABS.COMPLETED
        //         ]
        //         }
        //     }
        // }
    ];

    baseStage.push(
        {
            $addFields: {
                timelineStatus: {
                $cond: [
                    { $gte: ["$startDate", new Date()] },
                    commonConstants.CLIENT_ORDERS_TABLE_TABS.UPCOMING,
                    commonConstants.CLIENT_ORDERS_TABLE_TABS.COMPLETED
                ]
                }
            }
        }
    )

    // if(!isComplaints){
    baseStage.push(
        // NOTE: Populate organizer
        {
            $lookup: {
                from: 'serviceproviders',
                localField: 'organizer',
                foreignField: '_id',
                as: 'organizer'
            }
        },
        {
            $unwind: {
                path: '$organizer',
                preserveNullAndEmptyArrays: true
            }
        },
    )
    // }

    // NOTE : filter order by organizer name or business name  
    if(title && userRoles?.includes(commonConstants.roles.ADMIN)){
        // NOTE: concating both user first name and last name -> then save within new temp field
        baseStage.push(
            {
                $addFields: {
                    fullNameOrganizer: { $concat: ["$organizer.firstName", " ", "$organizer.lastName"] },
                }
            }
        )

        // NOTE: Case-insensitive partial match for business name
        baseStage.push(
            {
                $match: {
                    $or: [
                        {fullNameOrganizer: { $regex: title, $options: "i" } },
                        {"organizer.businessInformation.name": { $regex: title, $options: "i" } },
                        // {id: { $regex: title, $options: "i" } },
                        // {name: { $regex: title, $options: "i" } },
                    ]
                }
            }
        )
    }

    // NOTE: Sort closest first for clients :::  latest first for admins, service providers   
    baseStage.push({ $sort: { createdAt: -1 } });
    
    // NOTE: Pagination
    // if (limit && limit > 0) {
    //     baseStage.push({
    //         $facet: {
    //             paginatedData: [{ $skip: skip }, { $limit: limit }],
    //             metaData: [{ $count: "totalCount" }]
    //         }
    //     });
    // }

    // return baseStage;

    const final = [
        {
            $facet : {
                totalNumberOfPayouts: [
                    ...staticalPipeline,
                    {$count: "count"}
                ],
                completedPayouts: [
                    ...staticalPipeline,
                    // {
                    //     $match: {
                    //         $or: [
                    //             { payoutStatusTemp: commonConstants.payoutStatus.COMPLETED},
                    //             // { payoutStatusTemp: commonConstants.payoutStatus.PENDING },
                    //             // { payoutStatusTemp: commonConstants.payoutStatus.FAILED }
                    //         ]
                    //     }
                    // },
                    {
                        $match: { payoutStatusTemp: commonConstants.payoutStatus.COMPLETED}
                    },
                    {$count: "count"}
                ],
                pendingPayouts: [
                    ...staticalPipeline,
                    // {
                    //     $match: {
                    //         $or: [
                    //             // { payoutStatusTemp: commonConstants.payoutStatus.COMPLETED},
                    //             { payoutStatusTemp: commonConstants.payoutStatus.PENDING },
                    //             // { payoutStatusTemp: commonConstants.payoutStatus.FAILED }
                    //         ]
                    //     }
                    // },
                    {
                        $match: { payoutStatusTemp: commonConstants.payoutStatus.PENDING}
                    },
                    {$count: "count"}
                ],
                report: [ 
                    ...baseStage,
                    // {
                    //     $match: {
                    //         $or: [
                    //             { payoutStatusTemp: commonConstants.payoutStatus.COMPLETED},
                    //             // { payoutStatusTemp: commonConstants.payoutStatus.PENDING },
                    //             // { payoutStatusTemp: commonConstants.payoutStatus.FAILED }
                    //         ]
                    //     }
                    // },
                    {
                        $skip: skip
                    },
                    {
                        $limit: limit
                    }
                ],
                totalNumberOfRecords: [ 
                    ...baseStage,
                    {
                        $match: {
                            $or: [
                                { payoutStatusTemp: commonConstants.payoutStatus.COMPLETED},
                                // { payoutStatusTemp: commonConstants.payoutStatus.PENDING },
                                // { payoutStatusTemp: commonConstants.payoutStatus.FAILED }
                            ]
                        }
                    },
                    {$count: "count"}
                ]
            }
        }
    ]

    return final;
};