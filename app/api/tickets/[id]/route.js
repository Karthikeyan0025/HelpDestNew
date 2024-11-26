import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function DELETE(_, { params }) {
  const id = params.id;

  const supabase = createRouteHandlerClient({ cookies });

  const { error } = await supabase.from("tickets").delete().eq("id", id);

  return NextResponse.json({
    error,
  });
}

export async function PUT(req, { params }) {
  const id = params.id;
  const supabase = createRouteHandlerClient({ cookies });

  const ticketData = await req.json();

  const { data, error } = await supabase.from("tickets").update(ticketData).eq("id", id);
  
  return NextResponse.json({
    error,
    data,
    message: error ? null : "Ok",
  });
}
