
export async function geocodeAddress(query) {
  const q = (query || "").trim();
  if (!q) throw new Error("Adresse/village requis");

  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(q)}`;

  const res = await fetch(url, {
    headers: {
      Accept: "application/json",
      
      "User-Agent": "GreenMoveFrontend/1.0 (student-project)",
    },
  });

  if (!res.ok) throw new Error("Erreur géocodage");

  const data = await res.json();
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error("Adresse introuvable. Essaie une ville plus précise.");
  }

  return {
    lat: parseFloat(data[0].lat),
    lon: parseFloat(data[0].lon),
    display_name: data[0].display_name,
  };
}
