// ============================================
// SN1 DASHBOARD API
// Read-only connection to Google Sheet
// DO NOT MODIFY QR SCANNER API
// ============================================

const DASHBOARD_APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxpJ7ZfqMtqOW9B1Na6Bj4ah1kZU0KUBr_r3aD-upyAvSbTZB9pPlxZY7QvFtXSZgtT0w/exec";

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders()
  });
}

export async function onRequestGet() {
  try {

    const response = await fetch(DASHBOARD_APPS_SCRIPT_URL);

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
        message: "Dashboard API Error",
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
