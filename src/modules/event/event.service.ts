import { IEvent } from './event.interface';
import { Event } from './event.model';

// create events api 
const createEventIntoDB = async (payload: IEvent) => {
  const eventData = {
    ...payload,
    seat: Number(payload.seat),
    price: Number(payload.price),
    featured: String(payload.featured) === 'true' 
  };
  
  const result = await Event.create(eventData);
  return result;
};


// all event get api pagination
const getAllEventsFromDB = async (query: Record<string, unknown>) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10; 
  const skip = (page - 1) * limit;

  const filter: any = {};

  if (query.status) {
    filter.status = query.status;
  }

  const result = await Event.find(filter) 
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 }); 

  const total = await Event.countDocuments(filter);
  const totalPage = Math.ceil(total / limit);

  return {
    meta: {
      page,
      limit,
      total,
      totalPage,
    },
    result,
  };
};


// single events get api 
const getSingleEventFromDB = async (id: string) => {
  const result = await Event.findById(id);
  if (!result) {
    throw new Error('Event not found!');
  }
  return result;
};

// update events
const updateEventIntoDB = async (id: string, payload: Partial<IEvent>) => {
  const result = await Event.findByIdAndUpdate(id, payload, {
    new: true, 
    runValidators: true,
  });
  return result;
};

// delete events
const deleteEventFromDB = async (id: string) => {
  const result = await Event.findByIdAndDelete(id);
  return result;
};
export const EventServices = {
  createEventIntoDB,
  getAllEventsFromDB,
  getSingleEventFromDB,
  updateEventIntoDB,
  deleteEventFromDB,
};