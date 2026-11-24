import { useState } from 'react';
import { api } from '../api/index.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../components/Toast.jsx';
import { ROLE_LABEL } from '../config/menu.js';
import PageHeader from '../components/PageHeader.jsx';

export default function Profile() {
  const { user } = useAuth();
  const toast = useToast();
  const [form, setForm] = useState({ currentPassword: '', newPassword: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await api.auth.changePassword(form.currentPassword, form.newPassword);
      toast("Parol o'zgartirildi");
      setForm({ currentPassword: '', newPassword: '' });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <PageHeader title="Profil" />
      <div className="card narrow">
        <dl className="info">
          <dt>F.I.Sh.</dt>
          <dd>{user.fullName}</dd>
          <dt>Login</dt>
          <dd>{user.username}</dd>
          <dt>Rol</dt>
          <dd>{ROLE_LABEL[user.role]}</dd>
          {user.group && (
            <>
              <dt>Guruh</dt>
              <dd>{user.group.name}</dd>
            </>
          )}
        </dl>
      </div>

      <form className="card narrow" onSubmit={submit}>
        <h3>Parolni o'zgartirish</h3>
        <label className="field">
          <span>Joriy parol</span>
          <input
            type="password"
            autoComplete="current-password"
            value={form.currentPassword}
            onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
            required
          />
        </label>
        <label className="field">
          <span>Yangi parol (kamida 6 belgi)</span>
          <input
            type="password"
            autoComplete="new-password"
            minLength={6}
            value={form.newPassword}
            onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
            required
          />
        </label>
        {error && <div className="alert alert-error">{error}</div>}
        <button className="btn btn-primary" disabled={busy}>
          Saqlash
        </button>
      </form>
    </>
  );
}
