const { default: mongoose, Mongoose } = require("mongoose");
const dayjs = require("dayjs");
const axios = require("axios");
const amqp = require("amqplib");
const {
    RecordNotFoundError,
    ActionNotAllowedError,
    FailureOccurredError,
    CustomInternalServerError,
    ParameterNotProvidedError,
    CustomError,
    DeletionAbandoned,
} = require("../utils/errors/CustomErrors");
const commonConstants = require("../constants/commonConstants");
const handleResponse = require("../utils/response/response");
const paginationResponse = require("../utils/response/paginationResponse");
const { getNewID } = require("../utils/genOrderId/genOrderID");
const { catchAsync } = require("../utils/errors/catchAsync");
const currentEnvironment = require("../config/environmentConfig");
const User = require("../models/user");
const Event = require("../models/event");
const { getEventPipeline, getEventAttendeesPipeline, getAllEventAttendeesPipeline, getBookingReportPipeline, getCalanderPipeline, getSingleEvent, getSingleEventPipeline, getAllPayoutsPipeline, getServiceProWalletPipeline, getServiceProWalletMetricsPipeline, getServiceProEventMetrics } = require("../queries/event");
const ServiceProvider = require("../models/serviceProvider");
const { calculateDistanceInKm } = require("../utils/calculateDistanceInKm");
const {formatTimeDuration} = require("../utils/formatTimeDuration");

const utc = require('dayjs/plugin/utc');
dayjs.extend(utc);

let channel, connection;

// NOTE: establish rabbitmq connection
async function connectRabbitMqWithretry(retry = 5, delay = 3000){
    while(retry){
        try {
            connection = await amqp.connect(`amqp://${currentEnvironment.RABBIT_MQ_URL}`);            
            channel = await connection.createChannel();
            await channel.assertQueue("user_booked_event");
            console.log("Connected to RabbitMQ");
            return;
        } catch (error) {
            console.error("RabbitMQ Connection Error : " , error.message);
            retry --;
            console.error("Retrying again: " , retry);
            await new Promise(res => setTimeout(res, delay));
            
        }
    }
}
connectRabbitMqWithretry();

exports.createNewEvent = catchAsync(async (req, res, next) => {
    let {
        name,
        flyer,
        price,
        eventLocations,
    } = req.body;

    const userId = req?.user?._id;

    // creating service provider profile
    // const userProfile = await User.findById(userId);
    const userProfileRes = await axios.get(`${currentEnvironment.AUTH_SERVICE}/api/v${currentEnvironment.API_VERSION}/auth/user/${userId}`)
    const userProfile = userProfileRes?.data?.data;

    const servicepro = await ServiceProvider.findOne({id: userProfile?.id});
    let serviceProId = null;

    if(!servicepro){
        const newId = await getNewID(commonConstants.documentCounters.SERVICE_PRO);
        const newServicePro = await ServiceProvider.create({
            id: newId,
            firstName: userProfile?.firstName,
            lastName: userProfile?.lastName,
            email: userProfile?.email,
            roles: [commonConstants.roles.SERVICE_PRO],
            password: "#ServiceProPassword99",
            isOnboardingCompleted: true,
            isOnboardingVerified: true,
            isOnboardingRejected: false,
            isStillProcessing: false,
        })
        serviceProId = newServicePro?._id;
    }else{
        serviceProId = servicepro?._id
    }


    const newId = await getNewID(commonConstants.documentCounters.EVENT);
    if (!newId) {
        return next(new FailureOccurredError("ID Generation"));
    }

    const eventObject = {
        id: newId,
        name,
        price,
        pricePerMonth: 500,
        category: "Entertainment & Games",
        paymentMethod: commonConstants.eventPaymentMethods.INHOUSE,
        // description,
        maximumAttendees: 5000,
        flyer,
        eventType: commonConstants.eventType.PUBLIC,
        eventLocations: [{
            address: eventLocations,
            placeId: eventLocations,
            location: {
                type: "Point",
                coordinates: [79.8428, 6.9271] // longitude, latitude
            }
        }],
        schedulingType: commonConstants.schedulingType.ONETIME,
        organizer: serviceProId,
        date: new Date("2027-01-01")?.toISOString(),
    };

    const newEvent = new Event(eventObject);
    const createdEvent = await newEvent.save();

    if (!createdEvent) {
        return next(new FailureOccurredError("Event Creation"));
    }

    return handleResponse(res, 200, "Event Created Successfully", createdEvent);
});

// NOTE: Get event by the search params 
exports.getAllEvents = catchAsync( async(req,res,next)=>{
    let {
        heroSearchTerm,
        title,
        category,
        payment_status,
        status,
        location,
        locationLongitude,
        locationLatitude,
        date,
        startingDate, 
        endingDate,
        isOrders,
        serviceProviderId,
        longitude,
        latitude,
        isNearbyEvents,
        limit,
        offset,
    } = req.query;
    // get all the parameters in the query 
    
    const userId = req?.user?._id; 
    const userRoles = req?.user?.roles;

    if (offset && !limit) {
        limit = 10;
    } if (!offset && limit) {
        offset = 0;
    }

    offset = Number(offset);
    limit = Number(limit);
    let isNearbyReslts = isNearbyEvents || false;

    // NOTE: decides whether the request is expecting a paginated response or entire collection documents
    const isPaginated = (limit) && (limit > 0);

    let pipeline  = getEventPipeline({
        heroSearchTerm,
        title,
        category,
        payment_status,
        status,
        location,
        locationLongitude,
        locationLatitude,
        date,
        startingDate, 
        endingDate,
        isOrders,
        userId,
        userRoles,
        serviceProviderId,
        longitude,
        latitude,
        isNearbyEvents,
        limit,
        skip: offset,
    });

    let eventAggregation = await Event.aggregate(pipeline);

    if(isNearbyEvents){
        if(!eventAggregation[0]?.paginatedData?.length){
            isNearbyReslts = false;
            pipeline  = getEventPipeline({
                heroSearchTerm,
                title,
                category,
                status,
                location,
                locationLongitude,
                locationLatitude,
                date,
                startingDate, 
                endingDate,
                isOrders,
                userId,
                userRoles,
                serviceProviderId,
                longitude,
                latitude,
                limit,
                skip: offset,
            });
            eventAggregation = await Event.aggregate(pipeline);
        }
    }

    let events = {data: isPaginated ? eventAggregation[0]?.paginatedData : eventAggregation };

        events.data = events.data.map(event => ({
        ...event,
        // startingTime: dayjs(event.startingTime).format("HH:mm"),
        // endingTime: dayjs(event.endingTime).format("HH:mm"),
    }));

    if(isPaginated){
        events = {
            ...events,
            isNearbyReslts,
            timelineStatus: events?.data?.[0]?.timelineStatus,
            pagination : paginationResponse({
                offset: offset,
                limit: limit,
                totalDocuments: eventAggregation[0]?.metaData[0]?.totalCount,
            })
        }
    }

    // events.data = events?.data?.map(it => {
    //     if(it?.schedulingType === commonConstants.schedulingType.RECURRING){
    //         it.name = `${it?.name} - ${dayjs(it?.startDate)?.format("MMMM")}`
    //     }
    //     return it;
    // })
    
    return handleResponse(res, 200, "Events Fetched Successfully",events);
})

// NOTE: Get Event by event Id 
exports.getEventById = catchAsync(async(req,res,next)=>{

    const { longitude, latitude } = req.query;
    const eventId = req?.params?.id;

    if (!eventId) {
        return next(new ParameterNotProvidedError("Event Id"));
    }

    // Find by your custom event id
    const existingEvent = await Event.findOne({ _id: eventId }).populate("organizer");

    if (!existingEvent || existingEvent?.isDeleted) {
        return next(new RecordNotFoundError("Event"));
    }

    const eventLocation = existingEvent?.eventLocations?.[0]?.location?.coordinates;
    const distance = calculateDistanceInKm({longitude, latitude}, eventLocation);

    const eventObj = existingEvent.toObject();
    // eventObj.startingTime = dayjs(existingEvent.startingTime).format("HH:mm");
    // eventObj.endingTime = dayjs(existingEvent.endingTime).format("HH:mm");
    eventObj.distanceInKm = distance;

    // Ensure duration is calculated if not in the database
    if (!eventObj.duration && existingEvent.startingTime && existingEvent.endingTime) {
        const startTime = dayjs(existingEvent.startingTime).format("HH:mm");
        const endTime = dayjs(existingEvent.endingTime).format("HH:mm");
        eventObj.duration = formatTimeDuration(startTime, endTime, existingEvent.eventType);
    }

    const singleEvent = await Event.aggregate(getSingleEventPipeline({id: eventId}));

    // You can format or filter fields here if needed
    return handleResponse(res, 200, "Event Fetched Successfully", {
        ...eventObj,
        participantCount: singleEvent?.[0]?.participantCount,
        dateToBeCompared: singleEvent?.[0]?.dateToBeCompared,
        timelineStatus: singleEvent?.[0]?.timelineStatus,
    });
})

// NOTE: user booking an event
exports.bookEventByUser = catchAsync(async (req, res, next) => {
    const userId = req?.user?._id;
    const { eventId, platform = "web" } = req.body;

    // const user = await User.findById(userId);
    const userProfileRes = await axios.get(`${currentEnvironment.AUTH_SERVICE}/api/v${currentEnvironment.API_VERSION}/auth/user/${userId}`)
    const user = userProfileRes?.data?.data;
    
    if (!user || user?.isDeleted) {
        return next(new RecordNotFoundError("User"));
    }

    const event = await Event.findById(eventId);

    if (!event || event?.isDeleted) {
        return next(new RecordNotFoundError("Event"));
    }

    let eventbookingid = "";

    // ONETIME booking
    if (event?.schedulingType === commonConstants.schedulingType.ONETIME) {
        const now = new Date();

        if (event?.participants?.some(p => p?.user?.toString() === userId?.toString())) {
        return next(new CustomError("Event was already booked"));
        }

        if (event?.maximumAttendees <= event?.participants?.length) {
        return next(new CustomError("Maximum Attendees Exceed"));
        }

        if (event?.date < now) {
        return next(new CustomError("No upcoming date to book"));
        }

        const newBookingId = await getNewID(commonConstants.documentCounters.BOOKING);
        if (!newBookingId) return next(new FailureOccurredError("ID Generation"));

        eventbookingid = newBookingId;

        event?.participants?.push({
            user: userId,
            date: new Date()?.toISOString(),
            bookingId: newBookingId,
            paymentStatus: commonConstants.paymentStatus.PENDING,
            paymentAmount: event?.price,
            serviceProviderAmount: event?.price,
            userSelectedPaymentMethod: commonConstants.userSelectedPaymentMethod.INHOUSE,
        });
    }

    const saveEventDetails = await event.save();
    if (!saveEventDetails) return next(new FailureOccurredError("Booking The Event"));

    const userForMq = {
        id: user?._id,
        firstName: user?.firstName,
        lastName: user?.lastName,
        email: user?.email,
        event: event
    }
    console.log("trying to send message to the queue >>>>>>>>>>");
    
    if(channel){
        channel?.sendToQueue("user_booked_event", Buffer.from(JSON. stringify(userForMq)));
    }
    
    console.log("successed send message to the queue >>>>>>>>>>");

    return handleResponse(
        res,
        200,
        "Event Booked Successfully",
        `/payment-successful?status=success&event=${saveEventDetails?._id}&amount=${saveEventDetails?.price}&paymentMethod=${commonConstants.eventPaymentMethods.INHOUSE}&bookingId=${eventbookingid || ""}&paymentIntentId=`
    );
});

// NOTE : GET event organizer
exports.getEventOrganizer = catchAsync(async(req,res,next)=>{

    const userId = req?.params?.id;
    const user = await ServiceProvider.findById(userId).select("-password");

    if(!user || user?.isDeleted || user?.isDeleted || !user?.roles?.includes(commonConstants.roles.SERVICE_PRO)){
        return next(new RecordNotFoundError("Service Provider Profile"));
    }

     // check before parsing 
    user.isOnboardingCompleted = user.isOnboardingCompleted==='undefined' || user.isOnboardingCompleted===''?false:user.isOnboardingCompleted;
    user.isOnboardingVerified = user.isOnboardingVerified==='undefined'|| user.isOnboardingVerified===''?false:user.isOnboardingVerified;
    user.isOnboardingRejected = user.isOnboardingRejected==='undefined'|| user.isOnboardingRejected===''?false:user.isOnboardingRejected;
    user.isStillProcessing  = user.isStillProcessing==='undefined'|| user.isStillProcessing===''?false:user.isStillProcessing;
    user.onboardingRejectionReason = user?.isOnboardingRejected===true?user.onboardingRejectionReason:"";

    // NOTE; take the completed, upcoming count
    const eventCount = await Event.aggregate(getServiceProEventMetrics({serviceProviderId: userId}));

    return handleResponse(
        res,
        200, 
        "Service Provider Info get Successfully", 
        {
            ...user._doc, 
            totalCompleted: eventCount?.[0]?.completedMetrics?.find(it => it?.timelineStatus === commonConstants.CLIENT_ORDERS_TABLE_TABS.COMPLETED)?.count, 
            totalUpcoming: eventCount?.[0]?.completedMetrics?.find(it => it?.timelineStatus === commonConstants.CLIENT_ORDERS_TABLE_TABS.UPCOMING)?.count,
            totalReviews: eventCount?.[0]?.reviewsMetrics[0]?.totalReviews,
            avgRating: eventCount?.[0]?.reviewsMetrics[0]?.avgRating?.toFixed(1) || 0.00,
        }
    );
});