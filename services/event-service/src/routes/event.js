const express = require("express");
const router = express.Router();
const { authenticateUser } = require("../middlewares/authenticateUser");
const { authenticateServiceProvider } = require("../middlewares/authenticateServiceProvider");
const { authorizeRoles } = require('../middlewares/authorizeRoles');
const { roles } = require('../constants/commonConstants');
// const { jobPostValidator, deletePostValidator, documentIdValidator, paginationParametersValidator } = require("../validators/jobPost");
const { validate } = require("../utils/validations/validate");
const { createNewEvent ,getAllEvents, getEventById, bookEventByUser, getAllAttendeesOfSingleEvent, getAllAttendeesOfAllEvents, getEventOrganizer} = require("../controllers/event");
// const {createEventValidator, getEventValidator, editEventValidator, bookEventByUserValidator, raiseComplaintValidator, idValidator, getCalendarValidator} = require("../validators/event");

router.post('/', authenticateServiceProvider(), authorizeRoles([`${roles.USER}`]), createNewEvent);

router.get('/all', authenticateUser(), authorizeRoles([`${roles.USER}`]), getAllEvents);

router.get('/user/:id', authenticateUser(), authorizeRoles([`${roles.USER}`]), validate, getEventById);

router.post('/book-event', authenticateUser(), authorizeRoles([`${roles.USER}`]), bookEventByUser);

router.get('/organizer/:id', getEventOrganizer);

module.exports = router;
