"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreateForm() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [priority, setPriority] = useState("low");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    console.log("Title:", title);
    console.log("Body:", body);

    const description = await getOpenAIDescription(title, body);
    console.log("Generated Description:", description);
    const priority = description;

    const newTicket = { title, body: description, priority };

    try {
      const res = await fetch(`${location.origin}/api/tickets`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTicket),
      });

      const json = await res.json();

      if (json.error) {
        console.log("Error:", json.error);
      }

      if (json.data) {
        router.refresh();
        router.push("/tickets");
      }
    } catch (error) {
      console.error("Error submitting ticket:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      
      <form onSubmit={handleSubmit} className="w-1/2">
        <label>
          <span>Title:</span>
          <input required type="text" onChange={(e) => setTitle(e.target.value)} value={title} />
        </label>
        <label>
          <span>Body:</span>
          <textarea required onChange={(e) => setBody(e.target.value)} value={body} />
        </label>
        <label>
          <span>Priority:</span>
          <select onChange={(e) => setPriority(e.target.value)} value={priority}>
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>
        </label>
        <button className="btn-primary" disabled={isLoading}>
          {isLoading ? <span>Adding...</span> : <span>Add Ticket</span>}
        </button>
      </form>
    </>
  );
}


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