import { NextResponse } from "next/server";

/**
 * Weather API proxy — fetches current weather from OpenWeatherMap.
 * Falls back to time-based defaults if no API key is configured.
 *
 * Set OPENWEATHERMAP_API_KEY in .env.local to enable real weather.
 */
export async function GET() {
  const apiKey = process.env.OPENWEATHERMAP_API_KEY;
  const hour = new Date().getHours();

  // Default fallback (no API key)
  if (!apiKey) {
    return NextResponse.json({
      weather: hour >= 6 && hour < 18 ? "clear" : "night_clear",
      temp: 22,
      icon: hour >= 6 && hour < 18 ? "01d" : "01n",
      description: "晴れ",
      humidity: 50,
      windSpeed: 3,
      isDay: hour >= 6 && hour < 18,
      source: "fallback",
    });
  }

  try {
    // Tokyo coordinates
    const lat = 35.6762;
    const lon = 139.6503;
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=ja&appid=${apiKey}`,
      { next: { revalidate: 300 } } // Cache for 5 minutes
    );

    if (!res.ok) throw new Error(`OWM ${res.status}`);

    const data = await res.json();
    const main = data.weather?.[0]?.main?.toLowerCase() ?? "clear";
    const icon = data.weather?.[0]?.icon ?? "01d";
    const isDay = icon.endsWith("d");

    // Map OWM conditions to our simplified categories
    let weather = "clear";
    if (main.includes("rain") || main.includes("drizzle")) weather = "rain";
    else if (main.includes("snow")) weather = "snow";
    else if (main.includes("cloud")) weather = icon.endsWith("d") ? "cloudy" : "night_cloudy";
    else if (main.includes("thunder")) weather = "storm";
    else weather = isDay ? "clear" : "night_clear";

    return NextResponse.json({
      weather,
      temp: Math.round(data.main?.temp ?? 22),
      icon,
      description: data.weather?.[0]?.description ?? "晴れ",
      humidity: data.main?.humidity ?? 50,
      windSpeed: Math.round((data.wind?.speed ?? 3) * 10) / 10,
      isDay,
      source: "openweathermap",
    });
  } catch {
    return NextResponse.json({
      weather: hour >= 6 && hour < 18 ? "clear" : "night_clear",
      temp: 22,
      icon: "01d",
      description: "晴れ",
      humidity: 50,
      windSpeed: 3,
      isDay: hour >= 6 && hour < 18,
      source: "fallback",
    });
  }
}
