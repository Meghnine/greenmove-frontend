import React, { useMemo } from "react";

function labelMode(mode) {
  const m = String(mode || "");
  if (m.includes("foot")) return "Marche";
  if (m.includes("cycling")) return "Vélo";
  if (m.includes("driving")) return "Voiture";
  if (m.includes("transit")) return "Transports";
  return mode || "-";
}

function iconMode(mode) {
  const m = String(mode || "");
  if (m.includes("foot")) return "🚶‍♀️";
  if (m.includes("cycling")) return "🚴";
  if (m.includes("driving")) return "🚗";
  if (m.includes("transit")) return "🚌";
  return "🧭";
}

// Facteurs simples (cohérents) pour “CO2 évité vs voiture”
// Tu peux les ajuster après si besoin.
const CAR_KG_PER_KM = 0.192;     // ~192 g/km
const TRANSIT_KG_PER_KM = 0.04;  // ~40 g/km
const BIKE_KG_PER_KM = 0.0;
const WALK_KG_PER_KM = 0.0;

function kgPerKm(mode) {
  const m = String(mode || "");
  if (m.includes("driving")) return CAR_KG_PER_KM;
  if (m.includes("transit")) return TRANSIT_KG_PER_KM;
  if (m.includes("cycling")) return BIKE_KG_PER_KM;
  if (m.includes("foot")) return WALK_KG_PER_KM;
  return CAR_KG_PER_KM;
}

// Petit scoring (similaire à ton idée : pénalise CO2 + distance + durée)
function calcScore(distanceKm, co2Kg, dureeMin) {
  let s = 100;
  s -= (Number(co2Kg) || 0) * 10;
  s -= (Number(distanceKm) || 0) * 1;
  s -= (Number(dureeMin) || 0) * 0.2;
  s = Math.max(0, Math.min(100, s));
  return Math.round(s);
}

function formatKg(x) {
  const n = Number(x) || 0;
  return n.toFixed(n < 10 ? 2 : 1);
}

export default function BadgesPanel({ trips = [] }) {
  const stats = useMemo(() => {
    const total = trips.length;

    // “écolo” = tout sauf voiture
    const ecoTrips = trips.filter(t => !String(t.mode_transport || "").includes("driving"));
    const ecoCount = ecoTrips.length;
    const ecoPct = total ? Math.round((ecoCount / total) * 100) : 0;

    // CO2 évité vs voiture (à distance équivalente)
    let avoided = 0;
    for (const t of trips) {
      const d = Number(t.distance_km) || 0;
      const actual = Number(t.co2_kg);
      const actualKg = Number.isFinite(actual) ? actual : (d * kgPerKm(t.mode_transport));
      const carKg = d * CAR_KG_PER_KM;
      avoided += Math.max(0, carKg - actualKg);
    }

    // “Série écolo” : nb de jours consécutifs avec au moins 1 trajet écolo
    const byDay = new Map(); // yyyy-mm-dd => eco?
    for (const t of trips) {
      const day = new Date(t.created_at).toISOString().slice(0, 10);
      const isEco = !String(t.mode_transport || "").includes("driving");
      byDay.set(day, (byDay.get(day) || false) || isEco);
    }
    const days = Array.from(byDay.keys()).sort(); // ordre croissant
    let streak = 0;
    // calc streak depuis aujourd'hui vers arrière
    const today = new Date().toISOString().slice(0, 10);
    let cursor = today;
    while (true) {
      if (byDay.get(cursor)) streak += 1;
      else break;
      const d = new Date(cursor);
      d.setDate(d.getDate() - 1);
      cursor = d.toISOString().slice(0, 10);
    }

    // Score global = moyenne des scores trajets (ou 0 si vide)
    const avgScore = total
      ? Math.round(
          trips.reduce((acc, t) => acc + calcScore(t.distance_km, t.co2_kg, t.duree_min), 0) / total
        )
      : 0;

    // Badges
    const unlocked = [];

    if (total >= 1) unlocked.push({ key: "first", title: "Premier trajet", desc: "Trajet enregistré", icon: "✨" });

    if (avoided >= 1) unlocked.push({ key: "kg1", title: "1 kg évité", desc: "CO₂ évité vs voiture", icon: "🟢" });
    if (avoided >= 5) unlocked.push({ key: "kg5", title: "5 kg évité", desc: "CO₂ évité vs voiture", icon: "🔵" });
    if (avoided >= 10) unlocked.push({ key: "kg10", title: "10 kg évité", desc: "CO₂ évité vs voiture", icon: "🟣" });

    if (ecoCount >= 5) unlocked.push({ key: "eco5", title: "Écolo x5", desc: "5 trajets écolos", icon: "🌿" });
    if (streak >= 3) unlocked.push({ key: "streak3", title: "Série 3 jours", desc: "Trajet écolo 3 jours", icon: "🔥" });

    return { total, ecoCount, ecoPct, avoided, streak, avgScore, unlocked };
  }, [trips]);

  return (
    <div className="card">
      <div className="metricsRow">
        <div className="metric">
          <div className="metricLabel">Score écologique</div>
          <div className="metricValue">{stats.avgScore}/100</div>
        </div>

        <div className="metric">
          <div className="metricLabel">Trajets</div>
          <div className="metricValue">
            {stats.total} <span className="muted">(écolos: {stats.ecoCount} • {stats.ecoPct}%)</span>
          </div>
        </div>

        <div className="metric">
          <div className="metricLabel">CO₂ évité (vs voiture)</div>
          <div className="metricValue">{formatKg(stats.avoided)} kg ✅</div>
        </div>

        <div className="metric">
          <div className="metricLabel">Série écolo</div>
          <div className="metricValue">{stats.streak} jours 🔥</div>
        </div>
      </div>

      <div className="badgesHeader">
        <h3 style={{ margin: 0 }}>Badges</h3>
        <div className="muted">{stats.unlocked.length} débloqué(s)</div>
      </div>

      <div className="badgesGrid">
        {stats.unlocked.length === 0 ? (
          <div className="muted">Aucun badge pour l’instant. Enregistre quelques trajets 😉</div>
        ) : (
          stats.unlocked.map((b) => (
            <div className="badgeCard" key={b.key}>
              <div className="badgeIcon">{b.icon}</div>
              <div>
                <div className="badgeTitle">{b.title}</div>
                <div className="badgeDesc">{b.desc}</div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* mini rappel pédagogique */}
      {stats.total > 0 && (
        <div className="muted" style={{ marginTop: 10 }}>
          Exemple: un trajet {iconMode("driving")} voiture émet plus qu’un trajet {iconMode("cycling")} vélo pour la même distance.
        </div>
      )}
    </div>
  );
}
