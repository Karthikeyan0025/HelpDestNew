import { createTransport } from 'nodemailer';

export async function POST(request) {
  const body = await request.json();
  
  // Configure your email transport
  const transporter = createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
        rejectUnauthorized: false
      }
  });
  
  try {
    await transporter.verify();
    console.log('SMTP connection verified successfully');

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: body.ticketDetails.senderEmail,
      subject: body.subject,
      html: `
        <h2>New Ticket Created</h2>
        <p><strong>Title:</strong> ${body.ticketDetails.title}</p>
        <p><strong>Priority:</strong> ${body.ticketDetails.priority}</p>
        <p><strong>Category:</strong> ${body.ticketDetails.category}</p>
        <p><strong>Department:</strong> ${body.ticketDetails.department}</p>
        <p><strong>Impact:</strong> ${body.ticketDetails.impact}</p>
        <p><strong>Description:</strong> ${body.ticketDetails.description}</p>
      `,
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error('Error sending email:', error);
    return Response.json({ error: 'Failed to send email' }, { status: 500 });
  }
} 