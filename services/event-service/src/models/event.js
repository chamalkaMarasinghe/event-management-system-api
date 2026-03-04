const mongoose = require("mongoose");
const commonConstants = require("../constants/commonConstants");
const { Schema } = mongoose;

const eventLocationSchema = new mongoose.Schema(
    {
        address: {
            type: String,
            trim: true,
            // required: true
        },
        placeId: {
            type: String,
            trim: true,
        },
        location: {
            type: {
                type: String,
                enum: ['Point'],
                default: 'Point'
            },
            coordinates: {
                type: [Number], // [longitude, latitude]
            }
        },
    },
    { timestamps: true }
)

const participantSchema = new mongoose.Schema(
    {
        bookingId: {
            type: String,
            // required: true,
            unique: true,
            trim: true,
            index:true, 
            sparse:true
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            // required: true
        },
        date: {
            type: Date,
        },
        paymentStatus: {
            type: String,
            // enum: Object.values(commonConstants.paymentStatus),
            // required: true,
            default: commonConstants.paymentStatus.PENDING,
        },
        paymentMethod: {
            type: String,
            // enum: Object.values(commonConstants.paymentMethod),
            // required: true,
        },
        userSelectedPaymentMethod: {
            type: String,
            // enum: Object.values(commonConstants.userSelectedPaymentMethod),
        },
        paymentAmount: {
            type: Number,
            // required: true,
            min: [0, 'Payment amount must be greater than 0'],
        },
        subscriptionId: {
            type: String,
        },
        paymentIntentId: {
            type: String,
        },
        serviceProviderAmount: {
            type: Number,
            // required: true,
        },
        stripeProcessingFee: {
            type: Number,
            // required: true,
        },
        subscriptionStartDate: {
            type: Date,
        },
        subscriptionEndDate: {
            type: Date,
        },
        subscriptionCancelDate:{
            type: Date,
        },
        chargeId: {
            type: String,
        },
        transferId: {
            type: String,
        },
        isEventCancelledByServiceProvider: {
            type: Boolean
        },
        isRefunded: {
            type: Boolean
        },
        renewalReminderSent:{
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
)

const complaintSchema = new mongoose.Schema(
    {
        id: {
            type: String,
            // required: true,
            unique: true,
            trim: true,
            index:true, 
            sparse:true,
        },
        bookingId: {
            type: String,
            // required: true,
            unique: true,
            trim: true,
            index:true, 
            sparse:true
        },
        complaintType: {
            type: String,
            // required: true,
            // enum: Object.values(commonConstants.complaintTypes)
        },
        description: {
            type: String,
            // required: true,
            maxlength: 500,
        },
        attachment: {
            type: String
        },
        client: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            // required: true
        },
        clientName: {
            type: String,
            // required: true
        },
        clientEmail: {
            type: String,
            // required: true
        },
        dateSubmitted: {
            type: Date,
        },
        dateResolved: {
            type: Date,
        },
        status: {
            type: String,
            // required: true,
            // enum: Object.values(commonConstants.complaintStatus),
            default: commonConstants.complaintStatus.PENDING,
        },
    },
    { timestamps: true }
);
const eventSchema = new mongoose.Schema(
    {
        id: {
            type: String,
            // required: true,
            unique: true,
            trim: true
        },
        name: {
            type: String,
            // required: true,
            trim: true
        },
        price: {
            type: Number,
            min: 0,
            default: 0
        },
        pricePerMonth: {
            type: Number,
            min: 0,
            default: 0
        },
        recurringPrice: {
            type: Number,
            min: 0,
        },
        category: {
            type: String,
            // required: true,
            trim: true
        },
        paymentMethod: {
            type: [String],
            // required: true,
            default: [commonConstants.eventPaymentMethods.ONLINE],
            // enum: Object.values(commonConstants.eventPaymentMethods)
        },
        description: {
            type: String,
            // required: true,
            trim: true
        },
        maximumAttendees: {
            type: Number,
        },
        currentAttendees: {
            type: Number,
            min: 0,
            // required: true,
            default: 0
        },
        flyer: {
            type: [String],
            required: false
        },
        eventType: {
            type: String,
            // required: true,
            trim: true,
            default: commonConstants.eventType.PUBLIC,
            // enum: Object.values(commonConstants.eventType)
        },
        eventLocations: {
            type: [eventLocationSchema],
            // required: true
        },
        date: {
            type: Date,
        },
        eventStartDate: {
            type: Date,
        },
        eventEndDate: {
            type: Date,
        },
        recurringEventsDates: {
            type: [
                {
                    start: { type: Date },
                    end: { type: Date },
                    payoutStatus: {
                        type: String,
                        // enum: Object.values(commonConstants.payoutStatus),
                        default: commonConstants.payoutStatus.PENDING
                    },
                    payoutDate: { type: Date },
                    payoutId :{ type: String },
                    participants: {
                        type: [participantSchema],
                        required: false
                    }
                }
            ]
        },
        startingTime: {
            type: Date,
        },
        endingTime: {
            type: Date,
        },
        payoutStatusOneTime: {
            type: String,
            // enum: Object.values(commonConstants.payoutStatus),
            default: commonConstants.payoutStatus.PENDING
        },
        payoutOneTimeDate: { type: Date },
        payoutOneTimeId : {
            type: String
        },
        eventStatus: {
            type: String,
            // enum: Object.values(commonConstants.eventStatus),
            default: commonConstants.eventStatus.ACTIVE
        },
        duration: {
            type: String,
            default: ''
        },
        schedulingType: {
            type: String,
            // required: true,
            trim: true,
            default: commonConstants.schedulingType.ONETIME,
            // enum: Object.values(commonConstants.schedulingType)
        },
        recurringFrequency: {
            type: String,
            trim: true,
            // enum: Object.keys(commonConstants.recurringFrequency)
        },
        numberOfReccuringEvents: {
            type: Number,
            min: 1,
        },
        lastDayOfPayment: {
            type: Number,
            min: 1,
            max: 31
        },
        organizer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Serviceprovider",
            // required: true,
            default: null,
        },
        participants: {
            type: [participantSchema],
            required: false
        },
        complaint: {
            type: [complaintSchema], // Only one complaint can be raised per event
            required: false
        },
        isDeleted: {
            type: Boolean
        },
        deletedAt: {
            type: Date,
        },
    },
    { timestamps: true }
)

eventLocationSchema.index({ location: "2dsphere" });
const Event = new mongoose.model("Event", eventSchema);
module.exports = Event;