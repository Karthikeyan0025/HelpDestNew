import CreateForm from "./CreateForm";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

const CreateTicket = async () => {

  const supabase = createServerComponentClient({ cookies });
  const { data: { user }, error } = await supabase.auth.getUser();
  console.log("user>>>", user);
  
  return (
    <main>
      <h2 className="text-primary text-center">Add a new ticket</h2>
      <CreateForm users={user.id}/>
    </main>
  );
};

export default CreateTicket;
