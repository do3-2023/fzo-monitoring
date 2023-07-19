import { serve } from "https://deno.land/std@0.192.0/http/server.ts";

const handler = async (_request: Request): Promise<Response> => {
  const resp = await fetch("https://csrng.net/csrng/csrng.php", {
    headers: {
      accept: "application/json",
    },
  });

  return new Response(resp.body, {
    status: resp.status,
    headers: {
      "content-type": "application/json",
    },
  });
};

serve(handler);
