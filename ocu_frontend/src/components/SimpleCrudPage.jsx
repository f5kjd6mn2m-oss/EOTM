import { useState } from 'react';
import { useLoad } from '../hooks/useLoad.js';
import { useToast } from './Toast.jsx';
import Modal from './Modal.jsx';
import PageHeader from './PageHeader.jsx';
import StateView from './StateView.jsx';

/**
 * Oddiy "ro'yxat + qo'shish/tahrirlash/o'chirish" sahifasi (Guruhlar, Fanlar uchun).
 * config: { title, addLabel, api, columns:[{label, render(item)}], fields:[{name,label,type,min,max,required}],
 *           defaults, emptyText, deleteConfirm(item) }
 */
export default function SimpleCrudPage({ config }) {
  const toast = useToast();
  const { data, loading, error, reload } = useLoad(() => config.api.list(), []);
  const [modal, setModal] = useState(null); // { item|null }
  const [form, setForm] = useState({});
  const [formError, setFormError] = useState('');
  const [busy, setBusy] = useState(false);

  const openModal = (item) => {
    setForm(item ? { ...item } : { ...config.defaults });
    setFormError('');
    setModal({ item });
  };

  const save = async (e) => {
    e.preventDefault();
    setBusy(true);
    setFormError('');
    const body = {};
    config.fields.forEach((f) => {
      const v = form[f.name];
      body[f.name] = f.type === 'number' ? Number(v) : v;
    });
    if (modal.item) body.isActive = Boolean(form.isActive);
    try {
      if (modal.item) await config.api.update(modal.item._id, body);
      else await config.api.create(body);
      toast('Saqlandi');
      setModal(null);
      reload();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const remove = async (item) => {
    if (!window.confirm(config.deleteConfirm(item))) return;
    try {
      await config.api.remove(item._id);
      toast("O'chirildi");
      reload();
    } catch (err) {
      toast(err.message, 'error');
    }
  };

  return (
    <>
      <PageHeader
        title={config.title}
        actions={
          <button className="btn btn-primary" onClick={() => openModal(null)}>
            + {config.addLabel}
          </button>
        }
      />

      <StateView
        loading={loading && !data}
        error={error}
        onRetry={reload}
        empty={data && data.length === 0}
        emptyText={config.emptyText}
      >
        {data && (
          <div className="card table-wrap">
            <table className="table">
              <thead>
                <tr>
                  {config.columns.map((c) => (
                    <th key={c.label}>{c.label}</th>
                  ))}
                  <th>Holat</th>
                  <th className="right">Amallar</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item) => (
                  <tr key={item._id}>
                    {config.columns.map((c) => (
                      <td key={c.label}>{c.render(item)}</td>
                    ))}
                    <td>
                      <span className={`badge ${item.isActive ? 'badge-ok' : 'badge-off'}`}>
                        {item.isActive ? 'Faol' : 'Nofaol'}
                      </span>
                    </td>
                    <td className="right actions">
                      <button className="btn btn-ghost sm" onClick={() => openModal(item)}>
                        Tahrirlash
                      </button>
                      <button className="btn btn-ghost sm danger" onClick={() => remove(item)}>
                        O'chirish
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </StateView>

      {modal && (
        <Modal title={modal.item ? 'Tahrirlash' : config.addLabel} onClose={() => setModal(null)}>
          <form onSubmit={save}>
            {config.fields.map((f) => (
              <label key={f.name} className="field">
                <span>{f.label}</span>
                <input
                  type={f.type || 'text'}
                  min={f.min}
                  max={f.max}
                  maxLength={f.maxLength}
                  required={f.required !== false}
                  autoFocus={f === config.fields[0]}
                  value={form[f.name] ?? ''}
                  onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                />
              </label>
            ))}
            {modal.item && (
              <label className="check">
                <input
                  type="checkbox"
                  checked={Boolean(form.isActive)}
                  onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                />
                Faol
              </label>
            )}
            {formError && <div className="alert alert-error">{formError}</div>}
            <div className="modal-foot inline">
              <button type="button" className="btn btn-ghost" onClick={() => setModal(null)}>
                Bekor qilish
              </button>
              <button className="btn btn-primary" disabled={busy}>
                Saqlash
              </button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
