const APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbzDMYa0DttaLXrVscufwKhMNoJyNqORRL58EQzMmT0MB-UKQYR2IeRKA-qhnkaGG5Wt/exec";

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders()
  });
}

export async function onRequestPost(context) {

  try {

    const formData = await context.request.formData();

    const body = new URLSearchParams();

    for (const [key, value] of formData.entries()) {
      body.append(key, String(value));
    }

    const response = await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: body.toString()
    });

    const result = await response.text();

    return new Response(result, {
      status: response.status,
      headers: {
        ...corsHeaders(),
        "Content-Type": "application/json"
      }
    });

  } catch (error) {

    return new Response(
      JSON.stringify({
        success: false,
        message: "Cloudflare API Error",
        error: error.message
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders(),
          "Content-Type": "application/json"
        }
      }
    );

  }
}
