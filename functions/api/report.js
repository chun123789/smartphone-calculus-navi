function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=UTF-8",
      "cache-control": "no-store"
    }
  });
}

export async function onRequestGet() {
  return json({
    ok: true,
    message: "Use POST /api/report to submit issue reports."
  });
}

export async function onRequestPost(context) {
  try {
    const payload = await context.request.json();
    const pageUrl = typeof payload.pageUrl === "string" ? payload.pageUrl.slice(0, 400) : "";
    const message = typeof payload.message === "string" ? payload.message.slice(0, 4000) : "";

    if (!pageUrl || !message) {
      return json(
        {
          ok: false,
          error: "pageUrl and message are required."
        },
        400
      );
    }

    // TODO: Bind a durable store (KV, D1, or external inbox) here.
    return json({
      ok: true,
      saved: false,
      note: "Function stub received the payload. Connect storage before production use."
    });
  } catch {
    return json(
      {
        ok: false,
        error: "Invalid JSON body."
      },
      400
    );
  }
}

