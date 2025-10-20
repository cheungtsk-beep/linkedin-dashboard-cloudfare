export async function GET() {
  const sample = [
    { id: "p1", date: "2025-10-16", title: "Raffles Family Office post",
      content: "Ten years of building… legacy rooted in trust…",
      impressions: 8200, likes: 186, comments: 21, reposts: 7,
      followersDelta: 23, topic: "Leadership", format: "Image",
      tone: "Founder", authenticity: 78, outsideReposts: 1, url: "#" },
    { id: "p2", date: "2025-10-12", title: "CR7® LIFE HK opening",
      content: "Honoured to support the launch at Times Square…",
      impressions: 15600, likes: 402, comments: 55, reposts: 18,
      followersDelta: 61, topic: "Football", format: "Image",
      tone: "Corporate", authenticity: 63, outsideReposts: 6, url: "#" }
  ];
  return new Response(JSON.stringify(sample), { headers: { "content-type": "application/json" } });
}
