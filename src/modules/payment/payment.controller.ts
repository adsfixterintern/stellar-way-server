import { Request, Response } from 'express';
import catchAsync from '../../app/utils/catchAsync';
import { PaymentServices } from './payment.service';
import config from '../../app/config';

const paymentSuccess = catchAsync(async (req: Request, res: Response) => {
  const { transactionId } = req.params;

  await PaymentServices.confirmPayment(transactionId as string);
  res.redirect(`${config.clientUrl}/payment/success?tranId=${transactionId}`);
});

export const PaymentControllers = {
  paymentSuccess,
};