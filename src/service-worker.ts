const manifest = (self as any).__WB_MANIFEST;

const getHash = async (buffer: ArrayBuffer) => {
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hex = Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return hex;
};

self.addEventListener("fetch", (event: any) => {
  const url = event.request.url;

  const { pathname } = new URL(url);

  if (event.request.method === "POST" && pathname.endsWith("/upload"))
    event.respondWith(
      (async () => {
        const buffer = await event.request.arrayBuffer();

        const key = await getHash(buffer);

        const cache = await caches.open("glb");

        await cache.put(
          new Request(key),
          new Response(buffer, {
            status: 200,
            headers: {
              //   "Content-Type": "model/gltf-binary" ,
              "Content-Type": "application/octet-stream",
              "Access-Control-Allow-Origin": "*",
            },
          })
        );

        const u = new URL(event.request.url);
        u.search = "";
        u.hash = "";
        u.pathname = u.pathname.replace("/upload", `/get/${key}`);

        return new Response(JSON.stringify({ url: u.toString() }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      })()
    );

  if (event.request.method === "GET" && pathname.match(/\/get\/([^\/]+)$/)) {
    const key = pathname.match(/\/get\/([^\/]+)$/)?.[1];

    event.respondWith(
      (async () => {
        const cache = await caches.open("glb");

        const response = await cache.match(new Request(key ?? "@@@"));

        return response ?? new Response("", { status: 404 });
      })()
    );
  }
});
