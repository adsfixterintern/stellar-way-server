import nodemailer from 'nodemailer';

export const sendEmail = async (to: string, html: string, subject: string = "Notification from Savory Nest") => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Savory Nest" <${process.env.EMAIL_USER}>`,
    to,
    subject: subject,
    html,
  });
};