import nodemailer from 'nodemailer'; // Assuming you're using Nodemailer for sending emails

// Configure the email transport using your email service
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: 587, // Replace with your SMTP port
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  tls: {
      rejectUnauthorized: false
    }
});

// Function to send    email
export const sendReminderEmail = (ticket, priority) => {
  const mailOptions = {
    from: process.env.EMAIL_USER, // Sender address
    to: 'chidambaram.alagu@aalamsoft.com', // Replace with the recipient's email address
    subject: `Remainder for Ticket ID: ${ticket.id} - Priority: ${priority}`,
    text: `
      Hi,

      This is a remainder for your ticket titled "${ticket.title}" with priority "${priority}".
      Please take the necessary actions.

      Thank you!
    `,
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(`Error sending email: ${error}`);
    }
    console.log(`Email sent: ${info.response}`);
  });
};