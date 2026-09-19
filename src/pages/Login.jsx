import React, { useState } from "react";
import { loginUser } from "../api/client";
import { useAuth } from "../auth/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const nav = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    try {
      const data = await loginUser(email, password);
      login(data.access_token);
      nav("/planner");
    } catch (e) {
      setErr(e?.response?.data?.detail || "Erreur connexion");
    }
  }

  return (
    <div className="container">
      <h2>Connexion</h2>
      <form className="card" onSubmit={onSubmit}>
        <label>Email</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />

        <label>Mot de passe</label>
        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />

        <button className="btn" type="submit">Se connecter</button>

        {err && <p className="error">{err}</p>}

        <p className="muted">
          Pas de compte ? <Link to="/register">Créer un compte</Link>
        </p>
      </form>
    </div>
  );
}
