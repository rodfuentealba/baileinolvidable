import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

Deno.serve(async () => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const { data: userData, error: userError } = await supabase.auth.admin.createUser({
    email: "rodfuentealbauno@gmail.com",
    password: "baile05sept",
    email_confirm: true,
    user_metadata: { full_name: "Rodolfo" }
  });

  if (userError) return new Response(JSON.stringify({ error: userError.message }), { status: 400 });

  const userId = userData.user.id;

  await supabase.from("profiles").insert({ id: userId, email: "rodfuentealbauno@gmail.com", full_name: "Rodolfo" });
  await supabase.from("user_roles").insert({ user_id: userId, role: "admin" });

  return new Response(JSON.stringify({ success: true, userId }));
});
