import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../../store';
import { loginStart, loginSuccess, loginFailure, type User } from './authSlice';
import api from '../../api/axios';
import styles from './Login.module.css';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const { user, loading, error } = useSelector((state: RootState) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const from = (location.state as { from?: string } | null)?.from || '/dashboard';

  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    dispatch(loginStart());

    try {
      const { data: users } = await api.get(`/users?email=${email}`);

      if (users.length === 0 || users[0].password !== password) {
        dispatch(loginFailure('Email ou mot de passe incorrect'));
        return;
      }

      const raw = users[0] as User & { password: string };
      const userFromApi: User = {
        id: raw.id,
        email: raw.email,
        name: raw.name,
      };

      const fakeToken = btoa(
        JSON.stringify({
          userId: userFromApi.id,
          email: userFromApi.email,
          role: 'admin',
          exp: Date.now() + 3600000,
        })
      );

      dispatch(loginSuccess({ user: userFromApi, token: fakeToken }));
    } catch {
      dispatch(loginFailure('Erreur serveur'));
    }
  }

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h1 className={styles.title}>TaskFlow</h1>
        <p className={styles.subtitle}>Connectez-vous pour continuer</p>

        {error && <div className={styles.error}>{error}</div>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.input}
          required
        />

        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles.input}
          required
        />

        <button type="submit" className={styles.button} disabled={loading}>
          {loading ? 'Connexion...' : 'Se connecter'}
        </button>
      </form>
    </div>
  );
}
