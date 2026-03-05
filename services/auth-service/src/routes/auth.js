const express = require("express");
const router = express.Router();
const {
    signupAsUser,
    signin,
    getServiceProProfileById,
    getUser,
} = require("../controllers/auth");
const { roles } = require("../constants/commonConstants");

router.post("/signup/user", signupAsUser);

router.post("/signin/user", signin);

router.get("/user/:id", getUser);

module.exports = router;