import cron from 'node-cron';
import { sendReminderEmail } from './emailService';
import { createServerComponentClient } from '@supabase/supabase-js'; // Import Supabase client
const supabase = createServerComponentClient({ cookies }); // Initialize Supabase client

// Function to fetch tickets from Supabase
const fetchTickets = async () => {
  const { data, error } = await supabase
    .from("tickets")
    .select('id, created_at, status, priority, email_sent') // Specify the fields to select
    .eq('status', 'open'); // Filter to only fetch tickets with status 'open'
  if (error) {
    console.error('Error fetching tickets:', error);
    return [];
  }
  return data;
};

// Function to check SLA conditions and send reminders
const checkSLA = async () => {
  const tickets = await fetchTickets(); // Fetch tickets
  tickets.forEach(async ticket => { // Make the callback async
    const currentTime = new Date();
    const createdTime = new Date(ticket.created_at);
    const timeDiff = (currentTime - createdTime) / (1000 * 60 * 60);

    if (ticket.status.toLowerCase() === 'open' && ticket.email_sent === False) {
      if (ticket.priority === 'low priority' && timeDiff > 8) {
        await sendReminderEmail(ticket, 'low priority'); // Send reminder email
        await supabase.from("tickets").update({ email_sent: True }).eq('id', ticket.id); // Update email_sent to true
      } else if (ticket.priority.toLowerCase() === 'medium priority' && timeDiff > 6) {
        await sendReminderEmail(ticket, 'medium priority'); // Send reminder email
        await supabase.from("tickets").update({ email_sent: True }).eq('id', ticket.id); // Update email_sent to true
      } else if (ticket.priority.toLowerCase() === 'high priority' && timeDiff > 3) {
        await sendReminderEmail(ticket, 'high priority'); // Send reminder email
        await supabase.from("tickets").update({ email_sent: True }).eq('id', ticket.id); // Update email_sent to true
      }
    }
  });
};

// Function to start SLA checking
export const startSLAChecking = () => {
  const task = cron.schedule('*/5 * * * *', checkSLA); // Call checkSLA directly
  return task;
};