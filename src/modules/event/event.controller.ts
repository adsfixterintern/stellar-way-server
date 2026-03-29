import httpStatus from 'http-status';
import catchAsync from '../../app/utils/catchAsync';
import sendResponse from '../../app/utils/sendResponse';
import { EventServices } from './event.service';

// create event api 
const createEvent = catchAsync(async (req, res) => {
  if (req.file) {
    req.body.image = req.file.path; 
  }

  const result = await EventServices.createEventIntoDB(req.body);
  
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Event created successfully',
    data: result,
  });
});

const getAllEvents = catchAsync(async (req, res) => {
  const result = await EventServices.getAllEventsFromDB(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Events fetched successfully',
    meta: result.meta, 
    data: result.result,
  });
});

// get single event api 
const getSingleEvent = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await EventServices.getSingleEventFromDB(id as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Event fetched successfully',
    data: result,
  });
});

// update event
const updateEvent = catchAsync(async (req, res) => {
  const { id } = req.params;
  if (req.file) {
    req.body.image = req.file.path;
  }
  const result = await EventServices.updateEventIntoDB(id as string, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Event updated successfully',
    data: result,
  });
});

// delete event
const deleteEvent = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await EventServices.deleteEventFromDB(id as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Event deleted successfully',
    data: result,
  });
});
export const EventControllers = {
  createEvent,
  getAllEvents,
  getSingleEvent,
  updateEvent,
  deleteEvent,
};