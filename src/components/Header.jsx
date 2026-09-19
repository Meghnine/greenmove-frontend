import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Header() {
  const { isAuthed, logout } = useAuth();
  const nav = useNavigate();

  return (
    <header className="header">
      <div className="brand">GreenMove</div>
      <nav className="nav">
        {isAuthed ? (
          <>
            <Link to="/planner">Planifier</Link>
            <Link to="/history">Historique</Link>
            <button
              className="btn secondary"
              onClick={() => {
                logout();
                nav("/login");
              }}
            >
              Se déconnecter
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Connexion</Link>
            <Link to="/register">Inscription</Link>
          </>
        )}
      </nav>
    </header>
  );
}
