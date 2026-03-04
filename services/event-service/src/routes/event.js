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

// NOTE: Get all the events based on query parameters 
router.get('/all', authenticateUser(), authorizeRoles([`${roles.USER}`]), getAllEvents);

router.get('/all/service-pro', authenticateServiceProvider(), authorizeRoles([`${roles.SERVICE_PRO}`, `${roles.ADMIN}`]), getAllEvents);

router.get('/all/attendees/:id', authenticateServiceProvider(), authorizeRoles([`${roles.SERVICE_PRO}`]), getAllAttendeesOfSingleEvent);

router.get('/all/attendees', authenticateServiceProvider(), authorizeRoles([`${roles.SERVICE_PRO}`]),getAllAttendeesOfAllEvents);

// NOTE get event by id 
router.get('/user/:id', authenticateUser(), authorizeRoles([`${roles.USER}`]), validate, getEventById);

router.get('/service-pro/:id', authenticateServiceProvider(), authorizeRoles([`${roles.SERVICE_PRO}`, `${roles.ADMIN}`]), getEventById);

router.get('/service-pro/:id',authenticateServiceProvider(), authorizeRoles([`${roles.SERVICE_PRO}`, `${roles.ADMIN}`]), getEventById);

// NOTE: BOOK a event by the users 
router.post('/book-event', authenticateUser(), authorizeRoles([`${roles.USER}`]), bookEventByUser);

router.get('/organizer/:id', getEventOrganizer);

module.exports = router;
