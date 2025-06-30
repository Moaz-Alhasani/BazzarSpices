import nodemailer, { TransportOptions } from "nodemailer";

export const SendEmail = async (option: any) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_COMPANY,
      pass: process.env.PASSWORD_EMAIL,
    },
  } as TransportOptions);

  const emailOptions = {
    from: `"Bazzar&Spices" <${process.env.EMAIL_COMPANY}>`,
    to: option.email,
    subject: option.subject,
    text: option.message,
  };

  try {
    await transporter.sendMail(emailOptions);
    console.log(`Email sent to: ${option.email}`);
  } catch (error) {
    console.error(`Failed to send to ${option.email}:`, error);
    throw error; // إعادة رمي الخطأ للتعامل معه في الدالة الرئيسية
  }
};