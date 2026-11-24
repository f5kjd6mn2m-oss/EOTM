import { useState } from 'react';
import { api } from '../api/index.js';
import { useToast } from './Toast.jsx';
import Modal from './Modal.jsx';

/**
 * Jadvaldagi katak bosilganda ochiladi.
 *  - dars bor  -> ma'lumot (guruh, fan, o'qituvchi, vaqt) + o'zgartirish / o'chirish
 *  - dars yo'q -> yangi dars biriktirish formasi
 */
export default function LessonModal({ date, dateText, pairInfo, teacher, teachers, lesson, groups, subjects, onClose, onChanged }) {
  const toast = useToast();
  const [editing, setEditing] = useState(!lesson);
  const [form, setForm] = useState({
    group: lesson?.group?.id || '',
    subject: lesson?.subject?.id || '',
    teacher: lesson?.teacher?.id || teacher.id,
    room: lesson?.room || '',
  });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const when = `${dateText}, ${pairInfo.number}-para (${pairInfo.start}–${pairInfo.end})`;
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const save = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      if (lesson) {
        await api.lessons.update(lesson.id, { ...form, date });
        toast("Dars yangilandi");
      } else {
        await api.lessons.create({ date, pair: pairInfo.number, ...form });
        toast('Dars biriktirildi');
      }
      onChanged();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!window.confirm("Bu darsni olib tashlaysizmi?")) return;
    setBusy(true);
    try {
      await api.lessons.remove(lesson.id);
      toast('Dars olib tashlandi');
      onChanged();
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  if (!editing && lesson) {
    return (
      <Modal
        title="Dars ma'lumoti"
        onClose={onClose}
        footer={
          <>
            <button className="btn btn-danger" onClick={remove} disabled={busy}>
              O'chirish
            </button>
            <button className="btn btn-primary" onClick={() => setEditing(true)}>
              O'zgartirish
            </button>
          </>
        }
      >
        <dl className="info">
          <dt>Vaqt</dt>
          <dd>{when}</dd>
          <dt>Guruh</dt>
          <dd>{lesson.group?.name}</dd>
          <dt>Fan</dt>
          <dd>{lesson.subject?.name}</dd>
          <dt>O'qituvchi</dt>
          <dd>{lesson.teacher?.name}</dd>
          {lesson.room && (
            <>
              <dt>Xona</dt>
              <dd>{lesson.room}</dd>
            </>
          )}
        </dl>
        {error && <div className="alert alert-error">{error}</div>}
      </Modal>
    );
  }

  const activeGroups = groups.filter((g) => g.isActive || g._id === form.group);
  const activeSubjects = subjects.filter((s) => s.isActive || s._id === form.subject);

  return (
    <Modal title={lesson ? "Darsni o'zgartirish" : 'Dars biriktirish'} onClose={onClose}>
      <form onSubmit={save}>
        <p className="when-chip">{when}</p>

        <label className="field">
          <span>O'qituvchi</span>
          <select value={form.teacher} onChange={set('teacher')} required>
            {teachers.map((t) => (
              <option key={t.id} value={t.id}>
                {t.fullName}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>Guruh</span>
          <select value={form.group} onChange={set('group')} required>
            <option value="">— tanlang —</option>
            {activeGroups.map((g) => (
              <option key={g._id} value={g._id}>
                {g.name}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>Fan</span>
          <select value={form.subject} onChange={set('subject')} required>
            <option value="">— tanlang —</option>
            {activeSubjects.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>Xona (ixtiyoriy)</span>
          <input value={form.room} onChange={set('room')} maxLength={30} placeholder="Masalan: 204" />
        </label>

        {(groups.length === 0 || subjects.length === 0) && (
          <div className="alert alert-warn">Avval "Guruhlar" va "Fanlar" bo'limlarida kamida bittadan yarating.</div>
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
