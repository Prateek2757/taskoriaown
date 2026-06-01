export async function submitToIndexNow(urls: string[]) {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
    const key = process.env.INDEXNOW_KEY;
  
    if (!siteUrl || !key) {
      throw new Error("Missing NEXT_PUBLIC_SITE_URL or INDEXNOW_KEY");
    }
  
    const host = new URL(siteUrl).host;
  
    const payload = {
      host,
      key,
      keyLocation: `${siteUrl}/${key}.txt`,
      urlList: urls,
    };
  
    const res = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(payload),
    });
  
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`IndexNow failed: ${res.status} ${text}`);
    }
  
    return true;
  }