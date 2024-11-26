import Image from "next/image";
import Link from "next/link";
import Logo from "public/Teams-image.png";
import LogoutBtn from "./LogoutBtn";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";


// const supabase = createServerComponentClient({ cookies });
// const { data: { user }, error } = await supabase.auth.getUser();

async function getUserDetails() {
  const supabase = createServerComponentClient({ cookies });
  const { data: { user }, error } = await supabase.auth.getUser();
 
  console.log("useruseruser",user?.id);
 
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

const Navbar = async ({ user }) => {
  const { id,  role } = await getUserDetails();
  // console.log("555555555555656449 ------------>>>>>>>>>",role) 
  return (
    <nav>
      <Image src={Logo} alt="Helpdesk logo" width={70} quality={100} placeholder="blur" />
      <h1>Aalam Helpdesk</h1>
      <div className="flex gap-8 items-center">
        {/* <Link href="/">Dashboard</Link>  */}
        <Link href="/tickets">Tickets</Link>
        {/* <Link href="/adminDashboard">Admin Dashboard</Link> */}
        {role === "Admin" && <Link href="/adminDashboard">Admin Dashboard</Link>} 
        {role === "User" && <Link href="/userDashboard">User Dashboard</Link>}
      </div>
      <div className="flex items-center gap-4 ml-auto">
        {user && <span>Hello {user.email}</span>}
        <LogoutBtn />
      </div>
    </nav>
  );
};

export default Navbar;  