// src/utils/badges.js

export function getBadgesForResult(r, context = {}) {
  const badges = [];
  const mode = String(r?.mode || "");
  const co2 = Number(r?.co2_kg ?? 0);
  const t = Number(r?.duree_min ?? 0);
  const d = Number(r?.distance_km ?? 0);

  // --- Badges "sensibilisation" (simples et crédibles) ---
  // 1) Zéro émission
  if (co2 === 0) badges.push({ text: "Zéro CO₂", tone: "good" });

  // 2) Très faible CO2 (utile si tu as transport en commun / vélo avec facteur)
  if (co2 > 0 && co2 <= 0.2) badges.push({ text: "Très faible CO₂", tone: "good" });

  // 3) Rapide
  if (t > 0 && t <= 15) badges.push({ text: "Rapide", tone: "info" });

  // 4) Équilibré (bon compromis temps/CO2)
  if (t <= 45 && co2 <= 0.6) badges.push({ text: "Bon compromis", tone: "info" });

  // 5) Long à pied / vélo (sensibilisation sans juger)
  if (mode.includes("foot") && t >= 60) badges.push({ text: "Marche longue", tone: "warn" });
  if (mode.includes("cycling") && t >= 60) badges.push({ text: "Vélo long", tone: "warn" });

  // 6) Impact élevé (seuil simple)
  if (co2 >= 2) badges.push({ text: "Impact élevé", tone: "bad" });

  // 7) Option recommandée (si on te passe le mode recommandé)
  if (context.recommendedMode && r.mode === context.recommendedMode) {
    badges.unshift({ text: "Recommandé", tone: "star" });
  }

  // Petits emojis discrets (pas “ChatGPT style”)
  // tu peux les enlever si tu veux 100% sobre
  const withEmoji = badges.map((b) => ({
    ...b,
    text:
      b.tone === "star" ? `⭐ ${b.text}` :
      b.tone === "good" ? `🌿 ${b.text}` :
      b.tone === "warn" ? `⏳ ${b.text}` :
      b.tone === "bad"  ? `⚠️ ${b.text}` :
      `ℹ️ ${b.text}`,
  }));

  // éviter trop de badges
  return withEmoji.slice(0, 3);
}
