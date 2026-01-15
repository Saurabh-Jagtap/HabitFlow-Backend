import nodemailer from "nodemailer";

export const sendEmail = async ({ to, subject, html }) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com", // Hardcode this to be safe
    port: 465,              // CHANGE TO 465
    secure: true,           // MUST BE TRUE for port 465
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  console.log(`Sending email to ${to}...`);
  
  await transporter.sendMail({
    from: `"HabitFlow Support" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
  });
  
  console.log("Email sent successfully");
};