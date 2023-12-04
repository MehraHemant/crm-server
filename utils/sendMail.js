import nodemailer from "nodemailer";

export const sendMail = async (data) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    service: "gmail",
    port: 554,
    secure: true,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });
  await transporter
    .sendMail({
      from: "CRM",
      to: data.to,
      subject: data.subject,
      html: data.html,
    })
    .catch((err) => {
      console.log(err);
    });
};
