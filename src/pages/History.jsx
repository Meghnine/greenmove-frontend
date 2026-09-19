import React, { useEffect, useState } from "react";
import { getHistory } from "../api/client";
import BadgesPanel from "../components/BadgesPanel";

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

export default function History() {
  const [data, setData] = useState([]);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await getHistory();
        setData(res || []);
      } catch (e) {
        setErr(e?.response?.data?.detail || "Erreur historique (token ?)");
      }
    })();
  }, []);

  return (
    <div className="container">
      <h2>Historique</h2>

      {err && <p className="error">{err}</p>}

      {/* ✅ ICI les badges + stats */}
      <BadgesPanel trips={data} />

      <div className="card" style={{ marginTop: 14 }}>
        {!data.length ? (
          <p className="muted">Aucun trajet enregistré.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Mode</th>
                <th>Distance</th>
                <th>Durée</th>
                <th>CO₂</th>
              </tr>
            </thead>
            <tbody>
              {data.map((t) => (
                <tr key={t.id}>
                  <td>{new Date(t.created_at).toLocaleString()}</td>
                  <td>{iconMode(t.mode_transport)} {labelMode(t.mode_transport)}</td>
                  <td>{Number(t.distance_km).toFixed(2)} km</td>
                  <td>{Number(t.duree_min).toFixed(2)} min</td>
                  <td>{Number(t.co2_kg).toFixed(3)} kg</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
