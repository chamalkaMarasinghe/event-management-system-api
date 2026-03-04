exports.maxDistanceToFindNearbyEventsInMeters = 30000000, // 300 km radius
exports.maxDistanceToFindLocationFilterEventsInMeters = 200000000, // 20 km radius

  exports.paymentMetrics = {
    taskerCommision: 80, // 80%
    clientFee: 6, // 6%
    boundaryAmount: 200, // GHS
    minimumAmount: 30, // GHS
    flatFee: 20, // GHS
  }

exports.environmentTypes = {
  DEV: "DEV",
  PROD: "PROD",
};

exports.roles = {
  USER: "USER",
  TASKER: "TASKER",
  SERVICE_PRO: "SERVICE_PRO",
  ADMIN: "ADMIN",
};


exports.categoryOptions = {
  0: "Sports & Fitness",
  1: "Education & Learning",
  2: "Arts & Culture",
  3: "Technology & Innovation",
  4: "Business & Professional",
  5: "Health & Wellness",
  6: "Entertainment & Games",
  7: "Community & Social",
  8: "Other"
}

exports.monthOptions = [
  // { id: 0, value: "All Months" },
  { id: 1, value: "January" },
  { id: 2, value: "February" },
  { id: 3, value: "March" },
  { id: 4, value: "April" },
  { id: 5, value: "May" },
  { id: 6, value: "June" },
  { id: 7, value: "July" },
  { id: 8, value: "August" },
  { id: 9, value: "September" },
  { id: 10, value: "October" },
  { id: 11, value: "November" },
  { id: 12, value: "December" },
];

//! INFO: Complaint Types
exports.complaintTypes = {
  PRODUCT_ISSUE: 'Event Issue',
  SERVICE_COMPLAINT: 'Service Complaint',
  BILLING_PROBLEM: 'Billing Problem',
  DELIVERY_DELAY: 'Event Delay',
  OTHER: 'Other'
};

//! INFO: complaint status
exports.complaintStatus = {
  PENDING: "PENDING",
  RESOLVED: "RESOLVED"
};

exports.limitation = {
  FILES_LIMIT: 5,
  ID_LIMIT: 2,
};

exports.rolesForInquiry = {
  USER: "USER",
  SERVICE_PRO: "SERVICE_PRO",
  VISITOR: "VISITOR",
};

exports.serviceProIdTypes = {
  TYPE_1: "Type 1",
  TYPE_2: "Type 2"
}

exports.documentCounters = {
  THREAD: "Thread",
  OFFER: "Offer",
  ORDER: "Order",
  EVENT: "Event",
  PAYMENT: "Payment",
  REVISION: "Revision",
  ISSUE: "Issue",
  COMPLAINT: "Complaint",
  BOOKING: "Booking",
  REVIEW: "Review",
  USER: "User",
  SERVICE_PRO: "Serviceprovider",
  PAYMENT_HISTORY: "PaymentHistory"
};

exports.documentCountersMountingCount = 1000;

exports.emailSenderNickName = "KIdsPlan Team";

exports.emailSendingActionTypes = {
  RESET_PASSWORD: "reset-password",
  CONTACT_FORM: "contact-form",
  ICS: "ICS",
};

exports.types = {
  OTP_TOKEN: "otp_token",
};

exports.minutesTakenToExpireTheSigninOTP = 5;
exports.minutesTakenToExpireTheForgotPasswordToken = 6;

// exports.paymentTypes = {
//   BANK: 'BANK',
//   MOBILE_MONEY: 'MOBILE_MONEY',
// }

exports.idTypeOptions = {
  ID: "ID",
  Passport: "Passport",
};

exports.eventPaymentMethods = {
  INHOUSE: "INHOUSE",
  ONLINE: "ONLINE",
  SUBSCRIPTION: "SUBSCRIPTION",
}

exports.eventType = {
  PUBLIC: "PUBLIC",
  OPEN: "OPEN",
  PRIVATE: "PRIVATE"
}

exports.schedulingType = {
  ONETIME: "ONETIME",
  RECURRING: "RECURRING",
}

exports.recurringFrequency = {
  WEEKLY: {
    enum: "WEEKLY",
    days: 7
  },
  // MONTHLY: {
  //   enum: "MONTHLY",
  //   days: 30
  // },
  // DAILY: {
  //   enum: "DAILY",
  //   days: 1
  // },
}

exports.paymentHistoryTypes = {
  PAYMENT: "PAYMENT",
  PAYOUT: "PAYOUT"
}

exports.CLIENT_ORDERS_TABLE_TABS = {
  ALL: "ALL",
  UPCOMING: "UPCOMING",
  COMPLETED: "COMPLETED",
};

exports.SERVICE_PRO_WALLET_TABLE_TABS = {
  RECEIVED: "RECEIVED",
  PAYOUT_RECEIVED: "PAYOUT RECEIVED",
  IN_PROGRESS_PAYOUT: "IN-PROGRESS PAYOUT",
};

// INFO: thread status
exports.threadStatus = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
};

// INFO: review states
exports.reviewStatus = {
  ACTIVE: "ACTIVE",
  COMPLETED: "COMPLETED",
};

exports.paymentStatus = {
  PENDING: "PENDING",
  PAID: "PAID",
  FAILED: "FAILED",
  REFUNDED: "REFUNDED",
  CANCELED: "CANCELED",
  SUB_CANCELED: "SUB_CANCELED",
};

exports.paymentMethod = {
  CREDIT_CARD: "CREDIT_CARD",
  PREZELWAY_24: "PREZELWAY_24"
};

exports.userSelectedPaymentMethod = {
  INHOUSE: "INHOUSE",
  ONLINE: "ONLINE",
  SUBSCRIPTION: "SUBSCRIPTION",
};

exports.payoutStatus = {
  PENDING: "PENDING",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED"
};

exports.refundStatus = {
  PENDING: "PENDING",
  REFUNDED: "REFUNDED"
};

exports.eventStatus = {
  ACTIVE: "ACTIVE",
  COMPLETED: "COMPLETED",
  CANCELED: "CANCELED",
};

exports.PAYMENT_TYPES = {
  SUBSCRIPTION_BASED: "SUBSCRIPTION_BASED", 
  PAY_FOR_ONLY_ONE: "PAY_FOR_ONLY_ONE", 
};