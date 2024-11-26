import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import TicketList from './TicketList';

async function getTicketsOld() {
  const supabase = createServerComponentClient({ cookies });
  const { data, error } = await supabase.from("tickets").select();

  if (error) {
    console.log("Error fetching tickets:", error.message);
    return []; // Return an empty array in case of error
  }

//   console.log("Fetched tickets:", data);
  return data;
}

async function getUserDetails() {
  const supabase = createServerComponentClient({ cookies });
  const { data: { user }, error } = await supabase.auth.getUser();
 
  console.log("useruseruser",user.id);
 
  if (error) {
    console.log(error.message);
    return null;
  }
 
  // Assuming the user has a role column in the users table
  const { data: roleData } = await supabase
    .from("role_mapping")
    .select("role_name")
    .eq("user_id", user.id)
    .single();
console.log("roleData",roleData);
  return {
    id: user.id,
    role: roleData ? roleData.role_name : null,
  };
}
 
async function getTickets(role,id) {
  const supabase = createServerComponentClient({ cookies });
  let query = supabase.from("tickets").select();
  // console.log("role",role);
  // Role-based filtering
  if (role === "Admin") {
    query = query;
  } else if (role === "IT Team") {
    query = query.eq("asigned_to", id);
  } else if (role === "User") {
    query = query.eq("created_by", id);
  }
 
  // Add filtering for is_delete
  query = query.eq("is_delete", false);  
  query = query.order("updated_at", { ascending: false });  
 
  const { data, error } = await query;
 console.log("ERROR:::>/",data);
  if (error) {
    console.log(error.message);
  }
 
  return data;
}

// Server component to fetch tickets and render the client component
const TicketListServer = async () => {

  const { id, role } = await getUserDetails();
  console.log("id",id);
  if (!role) {
    return <p className="text-center">Unable to retrieve user role</p>;
  }
 
  const tickets = await getTickets(role,id);
  // const tickets = await getTickets(); // Call the getTickets function
  return <TicketList tickets={tickets} role={role}/>; // Pass the fetched tickets to the TicketList component
};

export default TicketListServer;