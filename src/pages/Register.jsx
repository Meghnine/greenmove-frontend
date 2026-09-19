import React, { useState } from "react";
import { registerUser } from "../api/client";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setMsg("");
    try {
      const res = await registerUser(email, password);
      setMsg(res?.message || "Compte créé ✅");
      setTimeout(() => nav("/login"), 700);
    } catch (e) {
      setErr(e?.response?.data?.detail || "Erreur inscription");
    }
  }

  return (
    <div className="container">
      <h2>Inscription</h2>
      <form className="card" onSubmit={onSubmit}>
        <label>Email</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />

        <label>Mot de passe</label>
        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />

        <button className="btn" type="submit">Créer mon compte</button>

        {msg && <p className="ok">{msg}</p>}
        {err && <p className="error">{err}</p>}

        <p className="muted">
          Déjà un compte ? <Link to="/login">Se connecter</Link>
        </p>
      </form>
    </div>
  );
}
