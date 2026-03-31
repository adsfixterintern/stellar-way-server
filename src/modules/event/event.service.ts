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

  const result = await Event.aggregate([
    { $match: filter },
    { $sort: { createdAt: -1 } },
    { $skip: skip },
    { $limit: limit },
    {
      $lookup: {
        from: 'eventbookings', 
        localField: '_id',
        foreignField: 'eventId',
        as: 'bookings',
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'bookings.userId',
        foreignField: '_id',
        as: 'bookedUsers',
      },
    },
    {
      $project: {
        title: 1,
        subTitle: 1,
        date: 1,
        time: 1,
        image: 1,
        seat: 1,
        price: 1,
        status: 1,
        featured: 1,
        bookedParticipants: {
          $map: {
            input: "$bookedUsers",
            as: "user",
            in: {
              name: "$$user.name",
              image: "$$user.image"
            }
          }
        }
      },
    },
  ]);

  const total = await Event.countDocuments(filter);
  return {
    meta: { page, limit, total, totalPage: Math.ceil(total / limit) },
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