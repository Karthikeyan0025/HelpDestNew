"use client";

import EditForm from "./EditForm";
import { useParams } from "next/navigation";

// Client component to handle routing
const ClientComponent = () => {
  const params = useParams(); // Access route parameters
  const id = params?.id; // Safely access id from params

  console.log("id--->", id);
  

  // Check if id is available before rendering EditForm
  if (!id) {
    return <div>Loading...</div>; // or any loading state you prefer
  }

  return (
    <main>
      <h2 className="text-primary text-center">Edit ticket</h2>
      <EditForm ticketId={id} /> {/* Pass the id to EditForm */}
    </main>
  );
};

export default ClientComponent;
