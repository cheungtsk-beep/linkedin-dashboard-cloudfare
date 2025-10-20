export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  if (!code) return new Response(JSON.stringify({ ok:false, error: "No code" }), { status: 400 });
  const origin = url.origin;
  return Response.redirect(origin + "/dashboard", 302);
}
