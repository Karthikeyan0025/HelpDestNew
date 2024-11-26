import nodemailer from 'nodemailer';

export async function sendTicketConfirmationEmail(userEmail, ticketDetails) {
  // Create transporter using Office 365 settings
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // Email content
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: userEmail,
    subject: 'Ticket Confirmation',
    html: `
      <h1>Ticket Confirmation</h1>
      <p>Thank you for submitting your ticket.</p>
      <p>Ticket Details:</p>
      <p>Ticket ID: ${ticketDetails.id}</p>
      <p>Subject: ${ticketDetails.subject}</p>
      <p>Status: ${ticketDetails.status}</p>
      <p>We will get back to you soon.</p>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
} 