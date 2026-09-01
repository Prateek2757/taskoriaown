const ORIGIN_HOST =
  "taskoriaown-942515104650.australia-southeast2.run.app";
const CANONICAL_HOST = "www.taskoria.com";
const APEX_HOST = "taskoria.com";
const ALLOWED_VISITOR_COUNTRIES = new Set(["AU", "NP"]);

function isVerifiedBot(request) {
  return request.cf?.botManagement?.verifiedBot === true;
}

function isPublicDocumentRequest(request, url) {
  if (request.method !== "GET" && request.method !== "HEAD") return false;

  const accept = request.headers.get("Accept") || "";
  if (!accept.includes("text/html")) return false;

  return !(
    url.pathname.startsWith("/api/") ||
    url.pathname.startsWith("/.well-known/") ||
    url.pathname === "/robots.txt" ||
    url.pathname.startsWith("/sitemap")
  );
}

function shouldBlockVisitor(request, url) {
  if (!isPublicDocumentRequest(request, url) || isVerifiedBot(request)) {
    return false;
  }

  const country = request.cf?.country;

  // Fail open when Cloudflare cannot determine a country. This avoids locking
  // out traffic from internal services while still blocking known locations.
  return Boolean(country && !ALLOWED_VISITOR_COUNTRIES.has(country));
}

function countryBlockedResponse() {
  return new Response("Taskoria is currently available in Australia only.", {
    status: 403,
    headers: {
      "Cache-Control": "private, no-store",
      "Content-Type": "text/plain; charset=utf-8",
      "X-Robots-Tag": "noindex",
    },
  });
}

function canonicalRedirect(requestUrl) {
  const redirectUrl = new URL(requestUrl);
  redirectUrl.protocol = "https:";
  redirectUrl.hostname = CANONICAL_HOST;
  redirectUrl.port = "";

  return Response.redirect(redirectUrl.toString(), 308);
}

function rewriteOriginLocation(location, originUrl) {
  if (!location) return null;

  const redirectUrl = new URL(location, originUrl);
  if (redirectUrl.hostname !== ORIGIN_HOST) return location;

  redirectUrl.protocol = "https:";
  redirectUrl.hostname = CANONICAL_HOST;
  redirectUrl.port = "";

  return redirectUrl.toString();
}

export default {
  async fetch(request) {
    const publicUrl = new URL(request.url);

    if (publicUrl.hostname === APEX_HOST) {
      return canonicalRedirect(publicUrl);
    }

    if (shouldBlockVisitor(request, publicUrl)) {
      return countryBlockedResponse();
    }

    const originUrl = new URL(request.url);
    originUrl.protocol = "https:";
    originUrl.hostname = ORIGIN_HOST;
    originUrl.port = "";

    const originRequest = new Request(originUrl.toString(), request);
    originRequest.headers.set("Host", ORIGIN_HOST);
    originRequest.headers.set("X-Forwarded-Host", CANONICAL_HOST);
    originRequest.headers.set("X-Forwarded-Proto", "https");
    originRequest.headers.set("X-Forwarded-Port", "443");

    const originResponse = await fetch(originRequest, { redirect: "manual" });

    // Returning the original response preserves WebSocket upgrades.
    if (originResponse.status === 101) return originResponse;

    const responseHeaders = new Headers(originResponse.headers);
    const rewrittenLocation = rewriteOriginLocation(
      responseHeaders.get("Location"),
      originUrl,
    );

    if (rewrittenLocation) {
      responseHeaders.set("Location", rewrittenLocation);
    }

    return new Response(originResponse.body, {
      status: originResponse.status,
      statusText: originResponse.statusText,
      headers: responseHeaders,
    });
  },
};
