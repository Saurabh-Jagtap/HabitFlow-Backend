import axios from 'axios';

export const sendEmail = async ({ to, subject, html }) => {
  const data = {
    sender: {
      name: "HabitFlow Support",
      email: process.env.SMTP_USER // This MUST match the email you verified in Brevo
    },
    to: [
      {
        email: to,
      },
    ],
    subject: subject,
    htmlContent: html,
  };

  try {
    await axios.post('https://api.brevo.com/v3/smtp/email', data, {
      headers: {
        'api-key': process.env.BREVO_API_KEY,
        'content-type': 'application/json',
        'accept': 'application/json'
      }
    });
    console.log("Email sent successfully via Brevo!");
  } catch (error) {
    console.error("Brevo Email Error:", error.response?.data || error.message);
    // Helpful log to see why it failed
    if (error.response?.status === 401) {
        console.error("Check your BREVO_API_KEY!");
    }
  }
};