const jwt = require("jsonwebtoken");
const axios = require("axios");

const currentEnvironment = require("../config/environmentConfig");
const JWT_SECRET = currentEnvironment.JWT_SECRET;

const User = require("../models/user");
const ServiceProvider = require("../models/serviceProvider");

const { catchAsync } = require("../utils/errors/catchAsync");

const {
    UnauthorizedError,
    RecordNotFoundError,
    ActionNotAllowedError,
    SuspendedTaskerError,
} = require("../utils/errors/CustomErrors");
const { UserAgent } = require("express-useragent");

exports.authenticateServiceProvider = (options = {}) => catchAsync(async (req, res, next) => {

    // console.log("req path===========");
    // console.log(req.originalUrl);
    
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return next(new UnauthorizedError());
    }

    const decodedToken = jwt.verify(token, JWT_SECRET);

    // const user = await User.findById(decodedToken._id).select("-password");
    const userProfileRes = await axios.get(`${currentEnvironment.AUTH_SERVICE}/api/v${currentEnvironment.API_VERSION}/auth/user/${decodedToken._id}`)
    const user = userProfileRes?.data?.data;

    if (!user) {
        return next(new RecordNotFoundError("User"));
    }

    if (user?.isDeleted) {
        return next(new UnauthorizedError());
    }

    if(options.checkSuspension && user?.isSuspended){
        return next(new SuspendedTaskerError());
    }

    if (user._id && user.roles) {
        req.user = { _id: user?._id, roles: user?.roles, email: user?.email, isSuspended: user?.isSuspended, isDeleted: user?.isDeleted};
    } else {
        return next(new UnauthorizedError());
    }

    next();
});