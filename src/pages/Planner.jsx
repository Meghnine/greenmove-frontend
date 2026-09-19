
import React, { useState } from "react";
import { compareItineraries, saveTrajet } from "../api/client";
import { geocodeAddress } from "../api/geocoding";
import MapView from "../components/MapView";
import ResultsTable from "../components/ResultsTable";

export default function Planner() {
  
  const [departText, setDepartText] = useState("Paris");
  const [arriveeText, setArriveeText] = useState("Lyon");

  
  const [depart, setDepart] = useState(null);   
  const [arrivee, setArrivee] = useState(null); 
  const [departLabel, setDepartLabel] = useState("");
  const [arriveeLabel, setArriveeLabel] = useState("");

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [recommended, setRecommended] = useState(null);
  const [selected, setSelected] = useState(null);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");

  async function onCompare() {
    setErr("");
    setMsg("");
    setLoading(true);
    setSelected(null);

    try {
      
      const dep = await geocodeAddress(departText);
      const arr = await geocodeAddress(arriveeText);

      const depCoords = { lat: dep.lat, lon: dep.lon };
      const arrCoords = { lat: arr.lat, lon: arr.lon };

      setDepart(depCoords);
      setArrivee(arrCoords);
      setDepartLabel(dep.display_name || departText);
      setArriveeLabel(arr.display_name || arriveeText);

      
      const data = await compareItineraries({
        depart: depCoords,
        arrivee: arrCoords,
        modes: ["foot-walking", "cycling-regular", "driving-car", "transit"],
      });

      setResults(data.results || []);
      setRecommended(data.recommended || null);
      setSelected(data.recommended || null);
    } catch (e) {
      setErr(e?.message || "Erreur compare");
      setResults([]);
      setRecommended(null);
      setSelected(null);
    } finally {
      setLoading(false);
    }
  }

  async function onSave() {
    setErr("");
    setMsg("");

    if (!selected || !depart || !arrivee) {
      setErr("Fais d'abord une comparaison et sélectionne un itinéraire.");
      return;
    }

    try {
      const payload = {
        point_depart: { ...depart, label: departLabel || departText },
        point_arrivee: { ...arrivee, label: arriveeLabel || arriveeText },
        mode_transport: selected.mode,
        distance_km: selected.distance_km,
        duree_min: selected.duree_min,
        co2_kg: selected.co2_kg,
        route_geojson: selected.geometry ? { geometry: selected.geometry } : null,
      };

      await saveTrajet(payload);
      setMsg("Trajet sauvegardé ✅");
    } catch (e) {
      setErr(e?.response?.data?.detail || "Erreur sauvegarde (token ?)");
    }
  }

  return (
    <div className="container">
      <h2>Planifier votre trajet</h2>

      <div className="grid">
        <div className="card">
          <h3>Recherche</h3>

          <label>Ville / adresse de départ</label>
          <input
            value={departText}
            onChange={(e) => setDepartText(e.target.value)}
            placeholder="Ex: Paris, France"
          />

          <label>Ville / adresse d’arrivée</label>
          <input
            value={arriveeText}
            onChange={(e) => setArriveeText(e.target.value)}
            placeholder="Ex: Lyon, France"
          />

          <div className="actions">
            <button className="btn" onClick={onCompare} disabled={loading}>
              {loading ? "Comparaison..." : "Comparer"}
            </button>

            <button className="btn secondary" onClick={onSave} disabled={!selected}>
              Sauvegarder
            </button>
          </div>

          {departLabel && arriveeLabel && (
            <p className="muted">
              ✅ {departLabel} → {arriveeLabel}
            </p>
          )}

          {msg && <p className="ok">{msg}</p>}
          {err && <p className="error">{err}</p>}
        </div>

        {/* Carte : si coords pas encore calculées, MapView centre sur défaut */}
        <MapView
          depart={depart}
          arrivee={arrivee}
          geometry={selected?.geometry}
        />
      </div>

      <ResultsTable
        results={results}
        recommendedMode={recommended?.mode}
        onSelect={(r) => setSelected(r)}
      />
    </div>
  );
}
