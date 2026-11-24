import { useState } from 'react';
import { api } from '../api/index.js';
import { generatePassword } from '../utils/password.js';
import Modal from './Modal.jsx';

const apiFor = (kind) => (kind === 'student' ? api.students : api.teachers);

function PasswordField({ value, onChange, label = 'Parol' }) {
  const [shown, setShown] = useState(true);
  return (
    <label className="field">
      <span>{label} (kamida 6 belgi)</span>
      <div className="input-row">
        <input
          type={shown ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          minLength={6}
          maxLength={72}
          required
          autoComplete="new-password"
        />
        <button type="button" className="btn btn-ghost" onClick={() => onChange(generatePassword())}>
          Yaratish
        </button>
        <button type="button" className="btn btn-ghost" onClick={() => setShown(!shown)}>
          {shown ? 'Yashirish' : "Ko'rsatish"}
        </button>
      </div>
    </label>
  );
}

/** Yaratish va tahrirlash formasi (teacher va student uchun) */
export function UserFormModal({ kind, user, groups, onClose, onSaved }) {
  const isStudent = kind === 'student';
  const editing = Boolean(user);
  const [form, setForm] = useState({
    fullName: user?.fullName || '',
    username: user?.username || '',
    password: editing ? '' : generatePassword(),
    group: user?.group?._id || '',
    department: user?.department || '',
    phone: user?.phone || '',
    isActive: user ? user.isActive : true,
  });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const common = { fullName: form.fullName, username: form.username, phone: form.phone };
      const extra = isStudent ? { group: form.group } : { department: form.department };
      if (editing) {
        const saved = await apiFor(kind).update(user._id, { ...common, ...extra, isActive: form.isActive });
        onSaved(saved, null);
      } else {
        const saved = await apiFor(kind).create({ ...common, ...extra, password: form.password });
        onSaved(saved, form.password);
      }
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  const noun = isStudent ? 'Talaba' : "O'qituvchi";

  return (
    <Modal title={editing ? `${noun}ni tahrirlash` : `${noun} qo'shish`} onClose={onClose}>
      <form onSubmit={submit}>
        <label className="field">
          <span>F.I.Sh.</span>
          <input value={form.fullName} onChange={set('fullName')} required minLength={3} maxLength={120} autoFocus />
        </label>
        <label className="field">
          <span>Login</span>
          <input
            value={form.username}
            onChange={set('username')}
            required
            minLength={3}
            maxLength={40}
            pattern="[A-Za-z0-9._\-]+"
            title="Lotin harflari, raqam va . _ - belgilari"
            autoComplete="off"
          />
        </label>
        {!editing && <PasswordField value={form.password} onChange={(v) => setForm({ ...form, password: v })} />}

        {isStudent ? (
          <label className="field">
            <span>Guruh</span>
            <select value={form.group} onChange={set('group')} required>
              <option value="">— tanlang —</option>
              {groups.map((g) => (
                <option key={g._id} value={g._id}>
                  {g.name}
                </option>
              ))}
            </select>
          </label>
        ) : (
          <label className="field">
            <span>Kafedra (ixtiyoriy)</span>
            <input value={form.department} onChange={set('department')} maxLength={120} />
          </label>
        )}
        <label className="field">
          <span>Telefon (ixtiyoriy)</span>
          <input value={form.phone} onChange={set('phone')} maxLength={30} />
        </label>

        {editing && (
          <label className="check">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
            />
            Faol (o'chirilsa tizimga kira olmaydi)
          </label>
        )}

        {error && <div className="alert alert-error">{error}</div>}
        <div className="modal-foot inline">
          <button type="button" className="btn btn-ghost" onClick={onClose}>
            Bekor qilish
          </button>
          <button className="btn btn-primary" disabled={busy}>
            {busy ? 'Saqlanmoqda…' : 'Saqlash'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

/** Parolni qayta o'rnatish */
export function ResetPasswordModal({ kind, user, onClose, onDone }) {
  const [password, setPassword] = useState(generatePassword());
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await apiFor(kind).resetPassword(user._id, password);
      onDone(user, password);
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  return (
    <Modal title={`Yangi parol — ${user.fullName}`} onClose={onClose}>
      <form onSubmit={submit}>
        <PasswordField value={password} onChange={setPassword} label="Yangi parol" />
        {error && <div className="alert alert-error">{error}</div>}
        <div className="modal-foot inline">
          <button type="button" className="btn btn-ghost" onClick={onClose}>
            Bekor qilish
          </button>
          <button className="btn btn-primary" disabled={busy}>
            Parolni yangilash
          </button>
        </div>
      </form>
    </Modal>
  );
}

/** Login/parol berilgandan keyin ko'rsatiladi — admin nusxalab o'qituvchiga beradi */
export function CredentialsModal({ user, password, onClose }) {
  const [copied, setCopied] = useState(false);
  const text = `Login: ${user.username}\nParol: ${password}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      /* clipboard ruxsat bermasa, foydalanuvchi qo'lda nusxalaydi */
    }
  };

  return (
    <Modal
      title="Kirish ma'lumotlari"
      onClose={onClose}
      footer={
        <>
          <button className="btn btn-ghost" onClick={copy}>
            {copied ? 'Nusxalandi ✓' : 'Nusxalash'}
          </button>
          <button className="btn btn-primary" onClick={onClose}>
            Tayyor
          </button>
        </>
      }
    >
      <p>
        <strong>{user.fullName}</strong> uchun login va parol:
      </p>
      <pre className="credentials">{text}</pre>
      <div className="alert alert-warn">Parol faqat hozir ko'rinadi. Uni saqlab oling va foydalanuvchiga bering.</div>
    </Modal>
  );
}
