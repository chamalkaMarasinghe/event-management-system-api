const { default: mongoose, Mongoose } = require("mongoose");
const jwt = require("jsonwebtoken");
const { catchAsync } = require("../utils/errors/catchAsync");
const User = require("../models/user");
const handleResponse = require("../utils/response/response");
const sendMail = require("../utils/email/sendEmail");
const {
  roles,
  types,
  minutesTakenToExpireTheSigninOTP,
  documentCounters,
} = require("../constants/commonConstants");
const { getNewID } = require("../utils/genCustomID/getNewID");
const currentEnvironment = require("../config/environmentConfig");
const {
  DuplicateRecordsError,
  FailureOccurredError,
  RecordNotFoundError,
  PasswordMismatchError,
} = require("../utils/errors/CustomErrors");
const JWT_SECRET = currentEnvironment.JWT_SECRET;
const SIGNIN_OTP_VERIFICATION = currentEnvironment.SIGNIN_OTP_VERIFICATION;

exports.signupAsUser = catchAsync(async (req, res, next) => {
  const { firstName, lastName, email, phoneNumber, password } = req.body;

  const userRoles = [`${roles.USER}`];

  const existingUser = await User.findOne({
    $or: [
      { email: email?.toString()?.toLowerCase() },
      { phoneNumber: { $eq: phoneNumber } },
    ],
  });

  if (existingUser)
    return next(new DuplicateRecordsError("Email Or Phone Number"));

  const newId = await getNewID(documentCounters.USER);

  if (!newId) {
    return next(new FailureOccurredError("ID Generation"));
  }

  const user = new User({
    id: newId,
    firstName,
    lastName,
    phoneNumber: phoneNumber,
    roles: userRoles,
    email: email?.toString()?.toLowerCase(),
    password,
  });

  const newUser = await user.save();

  if (!newUser) return next(new FailureOccurredError("User Registeration"));

  const details = {
    _id: newUser._id,
    roles: newUser.roles,
  };

  const accessToken = jwt.sign(details, JWT_SECRET, {
    expiresIn: "1h",
  });

  const userData = {
    _id: newUser._id,
    firstName: newUser.firstName,
    lastName: newUser.lastName,
    phoneNumber: newUser?.phoneNumber,
    email: newUser?.email,
  };

  return handleResponse(res, 201, "Signed up Successfully", {
    token: accessToken,
    userData,
  });
});

exports.signin = catchAsync(async (req, res, next) => {

  const { email, password, longitude, latitude } = req.body;
  
  const user = await User.findOne({
    $or: [{ email: email?.toString()?.toLowerCase() }, { phoneNumber: email }],
  });
  
  if (!user || user?.isDeleted) {
    return next(new RecordNotFoundError("User"));
  }

  const match = await user.comparePassword(password);

  if (!match) {
    return next(new PasswordMismatchError());
  }

  if (SIGNIN_OTP_VERIFICATION === "true") {
    const otp = await user.createOtp();

    await sendMail(user.email, "Your Sign-in OTP", {
      topic: `Hi ${user?.firstName || ""} ${user?.lastName || ""}`,
      content: `Your One-Time Password (OTP) for signing in to kidsplan is: ${otp}. This code will expire in ${minutesTakenToExpireTheSigninOTP} minutes. Do not share this code with anyone.`,
    });

    //generate token for verify the otp has not stolen
    const details = {
      _id: user._id,
      type: types.OTP_TOKEN,
    };

    // jwt token will be expired in 15m hour
    const otpToken = jwt.sign(details, JWT_SECRET, {
      expiresIn: `${minutesTakenToExpireTheSigninOTP?.toString()}m`,
    });

    return handleResponse(res, 200, "OTP sent Successfully", {
      token: otpToken,
      OTP: true,
    });
  } else {
    const details = {
      _id: user._id,
      roles: user.roles,
    };

    const accessToken = jwt.sign(details, JWT_SECRET, {
      expiresIn: "1h",
    });

    userData = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user?.phoneNumber,
      email: user?.email,
      profilePicture: user?.profilePicture,
      wishList: user?.wishList || [],
    };

    userData.wishList = []

    return handleResponse(res, 200, "Signed-in Successfully", {
      token: accessToken,
      OTP: false,
      userData,
    });
  }
});

exports.getUser = catchAsync(async(req,res,next)=>{

    const userId = req?.params?.id;
    
    const user = await User.findById(userId).select("-password");

    if(!user || user?.isDeleted || user?.isDeleted){
        return next(new RecordNotFoundError("User Profile"));
    }

    return handleResponse(
        res,
        200, 
        "User Info get Successfully", 
        user
    );
});
