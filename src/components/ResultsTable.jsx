import React from "react";

function modeLabelAndIcon(mode) {
  const m = String(mode || "");

  if (m.includes("foot")) {
    return { label: "Marche", icon: "🚶‍♀️" };
  }
  if (m.includes("cycling")) {
    return { label: "Vélo", icon: "🚴" };
  }
  if (m.includes("driving")) {
    return { label: "Voiture", icon: "🚗" };
  
  }

  if (m.includes("transit")) { 
    return { label : "Transports" , icon :"🚌"};

  }


  return { label: mode, icon: "❓" };
}

export default function ResultsTable({ results, recommendedMode, onSelect }) {
  if (!results?.length) return null;

  return (
    <div className="card">
      <div className="resultsHeader">
        <h3>Résultats</h3>
        <span className="muted">
          Recommandation écoresponsable
        </span>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Mode</th>
            <th>Distance</th>
            <th>Durée</th>
            <th>CO₂</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {results.map((r) => {
            const isReco = r.mode === recommendedMode;
            const { label, icon } = modeLabelAndIcon(r.mode);

            return (
              <tr key={r.mode} className={isReco ? "recoRow" : ""}>
                <td className="modeCell">
                  <span className="modeIcon">{icon}</span>
                  <span>{label}</span>
                  {isReco && <span className="badge">Recommandé⭐</span>}
                </td>

                <td>{r.distance_km.toFixed(2)} km</td>
                <td>{Math.round(r.duree_min)} min</td>
                <td className="co2">{r.co2_kg.toFixed(3)} kg</td>

                <td className="actionCell">
                <button
                  className={`btn ${!r.geometry ? "disabled" : ""}`}
                  disabled={!r.geometry}
                  onClick={() => onSelect(r)}
                >
                  Afficher
                </button>

                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

    </div>
  );
}
