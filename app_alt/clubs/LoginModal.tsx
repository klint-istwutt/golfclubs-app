"use client";

import { useState } from "react";
import { SupabaseClient, User } from "@supabase/supabase-js";

interface LoginModalProps {
  email: string;
  setEmail: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  onClose: () => void;
  setUser: (user: User | null) => void;
  supabase: SupabaseClient;
}

export function LoginModal({ email, setEmail, password, setPassword, onClose, setUser, supabase }: LoginModalProps) {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async () => {
    setLoading(true);
    setErrorMessage("");
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) setErrorMessage(error.message);
    else if (data.user) {
      setUser(data.user);
      onClose();
    }
  };

  const handleSignUp = async () => {
    setLoading(true);
    setErrorMessage("");
    const { data, error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (error) setErrorMessage(error.message);
    else if (data.user) {
      setUser(data.user);
      onClose();
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <h2>login / register</h2>
        <input type="email" placeholder="E-Mail" value={email} onChange={e => setEmail(e.target.value)} />
        <input type="password" placeholder="Passwort" value={password} onChange={e => setPassword(e.target.value)} />
        {errorMessage && <p className="error-text">{errorMessage}</p>}
        <div className="login-buttons">
          <button className="btn login-btn" onClick={handleLogin} disabled={loading}>login</button>
          <button className="btn register-btn" onClick={handleSignUp} disabled={loading}>register</button>
        </div>
      </div>
    </div>
  );
}
