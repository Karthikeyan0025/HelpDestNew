"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Chip,
  Grid,
} from "@mui/material";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
const supabase = createClientComponentClient();

export default function CreateForm({ ticketId }) {
  const router = useRouter();
  const ticket_id = ticketId ? ticketId : "";
  console.log("ticket_id>>>>", ticket_id);
  
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [priority, setPriority] = useState("low");
  const [isLoading, setIsLoading] = useState(false);
  const [category, setCategory] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [department, setDepartment] = useState("");
  const [impact, setImpact] = useState("");
  const [isAIChatOpen, setIsAIChatOpen] = useState(true);
  const [users, setUsers] = useState([]);
  const [asigned_to, setAssignedTo] = useState("");
  const [status, setStatus] = useState("Open");
  const [ticketStatusComment, setTicketStatusComment] = useState("");

  useEffect(() => {
    const fetchTicketDetails = async () => {
      const { data, error } = await supabase
        .from('tickets')
        .select('*')
        .eq('id', ticket_id) 
        .single(); // Get a single record

      if (error) {
        console.error("Error fetching ticket details:", error);
      } else {
        // Assuming the ticket data structure matches your state
        setTitle(data.title || "");
        setBody(data.body || "");
        setPriority(data.priority || "low");
        setCategory(data.category || "");
        setAttachments(data.attachments || []); // Handle attachments if any
        setDepartment(data.department || "");
        setImpact(data.impact || "");
        setAssignedTo(data.asigned_to || "");
        setStatus(data.status || "Open");
        setTicketStatusComment(data.ticket_status_comment || "");
      }
    };

    fetchTicketDetails();
  }, []); // Empty dependency array to run once on mount

  const handleSubmit = async (e) => {
    console.log("innn submit");
    
    e.preventDefault();
    setIsLoading(true);

    // Get current user's email from Supabase
    // const {
    //   data: { user },
    // } = await supabase.auth.getUser();
    // const userEmail = user?.email;
    // console.log("User Email:", userEmail);

    // const description = await getOpenAIDescription(title, body);
    // console.log("Generated Description:", description);
    // const priority = description;

    const newTicket = {
      title,
      body,
      priority,
      category,
      attachments,
      department,
      impact,
      asigned_to,
      status,
      ticket_status_comment: ticketStatusComment,
      updated_at: new Date().toISOString()
    };

    // Create the ticket in the database
    // Remove the following line to prevent creating a new ticket
    // const res = await fetch(`${location.origin}/api/tickets`, {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(newTicket),
    // });

    // Update the existing ticket in the database
    const res = await fetch(`${location.origin}/api/tickets/${ticket_id}`, { // Use ticket_id for updating
      method: "PUT", // Change method to PUT for updating
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTicket),
    });
    console.log("res --->",res);
    
    // Check if the response is ok and has content
    if (res.ok) {
      console.log("dddddddddddddddddddddddd 112");  
      const json = await res.json(); // Parse JSON only if the response is ok
      router.push("/tickets");
      router.refresh();
      if (json.error) {
        console.log(json.error.message);
        console.log(json.error);
      }
      console.log("sssssssssss",json.data);
      
      // if (json.data) {
      //   console.log("dddddd sasdsdsd");
        
      //   // Update the ticket in Supabase after creation
      //   const { error: updateError } = await supabase
      //     .from('tickets')
      //     .update({
      //       title,
      //       body,
      //       priority,
      //       category,
      //       attachments,
      //       department,
      //       impact,
      //       asigned_to,
      //       status,
      //       ticket_status_comment: ticketStatusComment,
      //     })
      //     .eq('id', json.data.id); // Assuming json.data.id contains the created ticket's ID
      //   console.log("line 134 innnnnnnnnnnnnnnnn");
        
      //   if (updateError) {
      //     console.error("Error updating ticket in Supabase:", updateError);
      //   }
      //   console.log("update done in 138");
        
      //   router.refresh();
      //   router.push("/tickets");
      // }
    } 
    else {
      console.error("Failed to update ticket:", res.status, res.statusText);
    }
  };

  const handleFileChange = (e) => {
    setAttachments(Array.from(e.target.files));
  };

  const handleRemoveFile = (fileToRemove) => {
    setAttachments(
      attachments.filter((file) => file.name !== fileToRemove.name)
    );
  };

  // New function to interact with OpenAI
  async function getOpenAIDescription(title, body) {
    try {
      console.log("Calling OpenAI with:", { title, body }); // Log the input
      const res = await fetch(`/api/openai`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, body }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const json = await res.json();
      console.log("OpenAI response:", json); // Log the response
      return json.description; // Assuming the response contains a 'description' field
    } catch (error) {
      console.error("Error fetching description from OpenAI:", error);
      return "Error generating description"; // Fallback message
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="w-1/2">
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Title</InputLabel>
              <TextField
                required
                onChange={(e) => setTitle(e.target.value)}
                value={title}
              />
            </FormControl>
          </Grid> 
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Description</InputLabel>
              <TextField
                required
                multiline
                onChange={(e) => setBody(e.target.value)}
                value={body}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Priority</InputLabel>
              <Select
                onChange={(e) => setPriority(e.target.value)}
                value={priority}
              >
                <MenuItem value="Low Priority">Low</MenuItem>
                <MenuItem value="Medium Priority">Medium</MenuItem>
                <MenuItem value="High Priority">High</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Category</InputLabel>
              <Select
                required
                onChange={(e) => setCategory(e.target.value)}
                value={category}
              >
                <MenuItem value="bug">Bug</MenuItem>
                <MenuItem value="feature">Feature Request</MenuItem>
                <MenuItem value="support">Support</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Attachments</InputLabel>
              <TextField
                type="file"
                inputProps={{ multiple: true }}
                onChange={handleFileChange}
                variant="outlined"
                fullWidth
                margin="normal"
              />
              <div style={{ marginTop: "10px" }}>
                {attachments.map((file) => (
                  <Chip
                    key={file.name}
                    label={file.name}
                    onDelete={() => handleRemoveFile(file)}
                    style={{ margin: "5px" }}
                  />
                ))}
              </div>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Impact</InputLabel>
              <Select
                required
                onChange={(e) => setImpact(e.target.value)}
                value={impact}
              >
                <MenuItem value="single">Single User</MenuItem>
                <MenuItem value="multiple">Multiple Users</MenuItem>
                <MenuItem value="department">Department Wide</MenuItem>
                <MenuItem value="organization">Organization Wide</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Department</InputLabel>
              <Select
                required
                onChange={(e) => setDepartment(e.target.value)}
                value={department}
              >
                <MenuItem value="IT">IT</MenuItem>
                <MenuItem value="HR">HR</MenuItem>
                <MenuItem value="Finance">Finance</MenuItem>
                <MenuItem value="Support">Support</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Assigned To</InputLabel>
              <Select
                required
                onChange={(e) => setAssignedTo(e.target.value)}
                value={asigned_to}
              >
                <MenuItem value="1f101ad5-921c-4d40-b616-c5a9f0e0051a">
                  karthikeyan.shanmugam@triventsys.com
                </MenuItem>
                <MenuItem value="c95d8c28-deb1-4709-9ff6-3bb8469b75c8">
                  chidambaramalagu003@gmail.com
                </MenuItem>
                <MenuItem value="c22869f8-ae08-479d-a66a-d6f34a49bd13">
                  tharane.tharan@aalamsoft.com
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Status</InputLabel>
              <Select
                required
                onChange={(e) => setStatus(e.target.value)}
                value={status}
              >
                <MenuItem value="Open">Open</MenuItem>
                <MenuItem value="InProgress">In Progress</MenuItem>
                <MenuItem value="Closed">Closed</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Ticket Status Comment</InputLabel>
              <TextField
                multiline
                onChange={(e) => setTicketStatusComment(e.target.value)}
                value={ticketStatusComment}
              />
            </FormControl>
          </Grid>
        </Grid>
        <Button className="btn-primary" type="submit" disabled={isLoading}>
          {isLoading ? <span>Updating...</span> : <span>Update Ticket</span>}
        </Button>
      </form>
    </>
  );
}
