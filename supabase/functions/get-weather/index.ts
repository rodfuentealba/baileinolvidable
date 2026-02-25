const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Map WMO weather codes to conditions
function wmoToCondition(code: number): string {
  if (code === 0 || code === 1) return "sunny";
  if (code === 2 || code === 3) return "cloudy";
  if (code >= 51 && code <= 57) return "drizzle";
  if (code >= 61 && code <= 67) return "rainy";
  if (code >= 71 && code <= 77) return "snowy";
  if (code >= 80 && code <= 82) return "rainy";
  if (code >= 95 && code <= 99) return "stormy";
  return "cloudy";
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Galzignano Terme coordinates
    const lat = 45.3167;
    const lon = 11.7333;

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&daily=temperature_2m_max,weather_code&timezone=Europe/Rome&forecast_days=1`;

    const res = await fetch(url);
    const data = await res.json();

    const current = {
      temp: Math.round(data.current.temperature_2m),
      condition: wmoToCondition(data.current.weather_code),
    };

    const forecast = {
      temp: Math.round(data.daily.temperature_2m_max[0]),
      condition: wmoToCondition(data.daily.weather_code[0]),
    };

    return new Response(JSON.stringify({ current, forecast }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
