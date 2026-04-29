import nodemailer from "nodemailer";
import config from "../config";

export const sendEmail = async (
  to: string,
  html: string,
  subject: string = "Notification from Savory Nest",
) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: config.email_user,
      pass: config.email_pass,
    },
  });

  await transporter.sendMail({
    from: `"Savory Nest" <${process.env.email_user}>`,
    to,
    subject: subject,
    html,
  });
};
