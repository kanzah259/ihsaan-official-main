import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json"
};

const json = (body: Record<string, unknown>, status = 200) => new Response(JSON.stringify(body), { status, headers: corsHeaders });
const validEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (request.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const authHeader = request.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) return json({ error: "Missing sign-in token" }, 401);

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceRoleKey) return json({ error: "Function is not configured" }, 500);

  const authAdmin = createClient(supabaseUrl, serviceRoleKey, { auth: { autoRefreshToken: false, persistSession: false } });
  const databaseAdmin = createClient(supabaseUrl, serviceRoleKey, { auth: { autoRefreshToken: false, persistSession: false } });
  const token = authHeader.slice("Bearer ".length);
  const { data: authData, error: authError } = await authAdmin.auth.getUser(token);
  const adminEmail = authData.user?.email?.toLowerCase();
  if (authError || !adminEmail) return json({ error: "Invalid sign-in token" }, 401);

  const caller = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY") || serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
    accessToken: async () => token,
    global: { headers: { Authorization: authHeader } }
  });
  const { data: callerRole, error: callerRoleError } = await caller.rpc("current_tracker_role");
  if (callerRoleError || callerRole !== "admin") return json({ error: "Admin access required" }, 403);

  const body = await request.json();
  const action = body?.action;
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  if (!validEmail(email)) return json({ error: "A valid email address is required" }, 400);

  if (action === "create_contributor") {
    const role = ["member", "editor", "admin"].includes(body?.role) ? body.role : "member";
    const password = typeof body?.password === "string" ? body.password : "";
    if (password.length < 6) return json({ error: "Starting password must be at least 6 characters" }, 400);
    const { data: users, error: usersError } = await authAdmin.auth.admin.listUsers({ page: 1, perPage: 1000 });
    if (usersError) return json({ error: "Could not check existing accounts" }, 500);
    const existingUser = users?.users.find((item) => item.email?.toLowerCase() === email);
    const { data: userData, error: userError } = existingUser
      ? await authAdmin.auth.admin.updateUserById(existingUser.id, { password, email_confirm: true })
      : await authAdmin.auth.admin.createUser({ email, password, email_confirm: true });
    if (userError || !userData.user) return json({ error: userError?.message || "Could not create contributor" }, 400);

    const { error: memberError } = await databaseAdmin
      .from("tracker_members")
      .upsert({ email, role, active: true }, { onConflict: "email" });
    if (memberError) {
      if (!existingUser) await authAdmin.auth.admin.deleteUser(userData.user.id);
      return json({ error: `Could not authorise contributor: ${memberError.message}` }, 500);
    }
    return json({ email });
  }

  if (action === "reset_contributor_password") {
    const { data: member } = await databaseAdmin.from("tracker_members").select("email, active").eq("email", email).maybeSingle();
    if (!member?.active) return json({ error: "Contributor is not active" }, 404);
    const { data: users, error: usersError } = await authAdmin.auth.admin.listUsers({ page: 1, perPage: 1000 });
    const user = users?.users.find((item) => item.email?.toLowerCase() === email);
    if (usersError || !user) return json({ error: "Contributor account was not found" }, 404);
    const password = typeof body?.password === "string" ? body.password : "";
    if (password.length < 6) return json({ error: "New password must be at least 6 characters" }, 400);
    const { error: updateError } = await authAdmin.auth.admin.updateUserById(user.id, { password });
    if (updateError) return json({ error: "Could not reset password" }, 500);
    return json({ email });
  }

  if (action === "update_contributor") {
    const role = ["member", "editor", "admin"].includes(body?.role) ? body.role : "member";
    const active = body?.active === true;
    const { error } = await databaseAdmin.from("tracker_members").update({ role, active }).eq("email", email);
    if (error) return json({ error: `Could not update contributor: ${error.message}` }, 500);
    return json({ email });
  }

  if (action === "remove_contributor") {
    const { error } = await databaseAdmin.from("tracker_members").delete().eq("email", email);
    if (error) return json({ error: `Could not remove contributor: ${error.message}` }, 500);
    return json({ email });
  }

  return json({ error: "Unknown action" }, 400);
});
