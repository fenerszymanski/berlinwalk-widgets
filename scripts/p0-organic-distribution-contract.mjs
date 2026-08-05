export const CANONICAL_TRIP_PLANNER_URL =
  "https://www.berlinwalk.com/berlin-trip-planner";
export const TRIP_PLANNER_CAMPAIGN = "tp_first_sale_aug2026";

const SURFACE_PATTERN = /^[a-z0-9]+(?:_[a-z0-9]+)*$/;
const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term"
];
const EXTERNAL_KEYS = [...UTM_KEYS, "fbclid", "fbc", "fbp"];

export function assertSurfaceId(surfaceId) {
  if (typeof surfaceId !== "string" || !SURFACE_PATTERN.test(surfaceId)) {
    throw new Error("invalid_trip_planner_distribution_surface");
  }
  return surfaceId;
}

export function buildTripPlannerDistributionUrl(surfaceId) {
  const url = new URL(CANONICAL_TRIP_PLANNER_URL);
  url.searchParams.set("bw_internal_campaign", TRIP_PLANNER_CAMPAIGN);
  url.searchParams.set("bw_internal_content", assertSurfaceId(surfaceId));
  return url.toString();
}

export function preserveExternalAttribution(targetUrl, currentQuery) {
  const target = new URL(targetUrl);
  const current = new URLSearchParams(currentQuery || "");
  const hasExternal = EXTERNAL_KEYS.some((key) => current.get(key));
  if (!hasExternal) return target.toString();
  for (const key of EXTERNAL_KEYS) {
    const value = String(current.get(key) || "").slice(0, 120);
    if (value) target.searchParams.set(key, value);
  }
  return target.toString();
}

export const TOOL_CTA_CONTRACT = Object.freeze([
  {
    file: "berlin-first-day-planner/index.html",
    surface: "tool_first_day_result_v1",
    copy: "Your first day is shaped. If you want the same logic across the whole stay, I can build your arrival, departure and fixed bookings into one private Web plan and matching PDF.",
    anchor: "Build the rest of my Berlin trip"
  },
  {
    file: "luggage-storage-map/index.html",
    surface: "tool_luggage_result_v1",
    copy: "Found where to leave your bags? I can build the before-check-in hours and the rest of your stay into one route.",
    anchor: "Plan my Berlin stay around check-in"
  },
  {
    file: "how-many-days-in-berlin/index.html",
    surface: "tool_trip_length_result_v1",
    copy: "You have chosen the trip length. Now turn your exact dates, hours and fixed bookings into the full route.",
    anchor: "Build my date-specific Berlin plan"
  }
]);

export const BLOG_CTA_CONTRACT = Object.freeze([
  {
    slug: "berlin-public-transport-explained-for-tourists-u-bahn-s-bahn-tram-bus",
    copy: "Tickets explain how to move; they do not decide what fits into each day. I can turn your dates, stay area and fixed bookings into one practical Berlin route.",
    anchor: "Build my day-by-day Berlin route",
    surface: "post_public_transport_route_v1",
    anchorTerms: ["24-hour ticket", "best deal for occasional riders"]
  },
  {
    slug: "how-to-get-from-berlin-airport-to-alexanderplatz-the-easy-way",
    copy: "Once you know how you will reach Alexanderplatz, I can build your actual arrival time, stay area and departure into one practical Berlin plan.",
    anchor: "Plan my Berlin days from arrival",
    surface: "post_ber_airport_alex_v1",
    anchorTerms: ["bulleted_list", "fex + transfer", "s9 direct", "taxi:"]
  },
  {
    slug: "luggage-storage-in-berlin-2026",
    copy: "Once you know where the bags go, I can build the hours before check-in and the rest of your stay into one workable route.",
    anchor: "Build my trip around check-in",
    surface: "post_luggage_checkin_v1",
    anchorTerms: ["html", "luggage-storage-map/"]
  },
  {
    slug: "berlin-on-a-monday",
    copy: "Coming on a Monday? I can build your actual dates around museum closures, fixed bookings and the hours you have.",
    anchor: "Plan my Berlin dates around closures",
    surface: "post_monday_closures_v1",
    anchorTerms: ["html", "berlin-monday-plan-checker/"]
  },
  {
    slug: "how-many-days-in-berlin",
    copy: "Once you know how long to stay, I can turn your arrival, departure and saved places into one private Web plan and matching PDF.",
    anchor: "Build my Berlin trip around my dates",
    surface: "post_how_many_days_v1",
    anchorTerms: ["html", "/how-many-days-in-berlin/?"]
  }
]);
