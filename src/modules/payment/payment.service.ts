import mongoose from 'mongoose';
import { EventBooking } from '../event-booking/eventBooking.model';
import { Event } from '../event/event.model';

const confirmPayment = async (transactionId: string) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    const booking = await EventBooking.findOne({ transactionId }).session(session);
    if (!booking) {
      throw new Error('Booking not found!');
    }
    await EventBooking.findOneAndUpdate(
      { transactionId },
      { paymentStatus: 'paid' },
      { session }
    );
    await Event.findByIdAndUpdate(
      booking.eventId,
      { $inc: { seat: -booking.numberOfSeats } },
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return { message: 'Payment confirmed and seats updated!' };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

export const PaymentServices = {
  confirmPayment,
};