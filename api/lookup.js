export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ success: false, error: "Method not allowed" });
  const key = process.env.PLATEAPI_KEY;
  if (!key) return res.status(500).json({ success: false, error: "Server is not configured. Add PLATEAPI_KEY in Vercel environment variables." });

  const plate = String(req.body?.plate || "").toUpperCase().replace(/[^A-Z0-9- ]/g, "").trim();
  if (!plate || plate.length > 10) return res.status(400).json({ success: false, error: "Enter a valid registration plate (up to 10 characters)." });

  const url = new URL("https://api.plateapi.com.au/api/v1/lookup");
  url.searchParams.set("plate", plate);
  url.searchParams.set("state", "WA");
  url.searchParams.set("detailed", "true");

  try {
    const upstream = await fetch(url, {
      method: "GET",
      headers: { "X-API-Key": key, "Accept": "application/json" }
    });
    const data = await upstream.json();
    if (!upstream.ok || !data.success) {
      return res.status(upstream.status || 502).json({
        success: false,
        code: data.code || "provider_error",
        error: data.error || data.detail || "The vehicle provider could not complete this lookup."
      });
    }
    const candidates = [data.vehicle, ...(data.alternatives || [])].filter(Boolean);
    return res.status(200).json({
      success: true,
      vehicle: data.vehicle,
      candidates,
      match: data.match || "unknown",
      request_id: data.request_id,
      sandbox: Boolean(data.sandbox),
      quota_remaining: upstream.headers.get("X-RateLimit-Remaining"),
      quota_plan: upstream.headers.get("X-RateLimit-Plan")
    });
  } catch (error) {
    return res.status(502).json({ success: false, error: "Could not reach PlateAPI. Please try again." });
  }
}