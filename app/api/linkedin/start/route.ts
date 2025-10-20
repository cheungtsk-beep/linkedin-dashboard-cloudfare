export async function GET() {
  const clientId = process.env.LINKEDIN_CLIENT_ID;
  const redirectUri = encodeURIComponent("https://your-pages-domain.workers.dev/api/linkedin/callback");
  const scope = encodeURIComponent("r_liteprofile r_member_social r_organization_social w_member_social");
  const state = Math.random().toString(36).slice(2);
  const url = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=${state}`;
  return Response.redirect(url, 302);
}
