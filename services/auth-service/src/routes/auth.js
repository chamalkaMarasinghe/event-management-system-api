const express = require("express");
const router = express.Router();
const {
    signupAsUser,
    signin,
    getServiceProProfileById,
} = require("../controllers/auth");
const { roles } = require("../constants/commonConstants");

router.post("/signup/user", signupAsUser);

router.post("/signin/user", signin);

module.exports = router;