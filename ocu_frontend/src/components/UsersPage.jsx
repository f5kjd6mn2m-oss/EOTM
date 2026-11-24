import { useEffect, useState } from 'react';
import { api } from '../api/index.js';
import { useLoad } from '../hooks/useLoad.js';
import { useToast } from './Toast.jsx';
import PageHeader from './PageHeader.jsx';
import StateView from './StateView.jsx';
import { CredentialsModal, ResetPasswordModal, UserFormModal } from './UserModals.jsx';

/** O'qituvchilar va Talabalar sahifasi uchun umumiy komponent (kind = 'teacher' | 'student') */
export default function UsersPage({ kind }) {
  const isStudent = kind === 'student';
  const res = isStudent ? api.students : api.teachers;
  const toast = useToast();

  const [search, setSearch] = useState('');
  const [debounced, setDebounced] = useState('');
  const [groupFilter, setGroupFilter] = useState('');
  const [modal, setModal] = useState(null); // {type: 'form'|'reset'|'creds', user, password}

  useEffect(() => {
    const t = setTimeout(() => setDebounced(search.trim()), 300);
    return () => clearTimeout(t);
  }, [search]);

  const users = useLoad(() => res.list({ search: debounced, group: groupFilter }), [kind, debounced, groupFilter]);
  const groups = useLoad(() => (isStudent ? api.groups.list() : Promise.resolve([])), [kind]);

  const remove = async (u) => {
    if (!window.confirm(`${u.fullName} ni o'chirasizmi?`)) return;
    try {
      await res.remove(u._id);
      toast("O'chirildi");
      users.reload();
    } catch (err) {
      toast(err.message, 'error');
    }
  };

  const saved = (user, password) => {
    users.reload();
    // Yangi yaratilgan bo'lsa — login/parolni ko'rsatamiz
    setModal(password ? { type: 'creds', user, password } : null);
    if (!password) toast('Saqlandi');
  };

  const title = isStudent ? 'Talabalar' : "O'qituvchilar";
  const list = users.data || [];

  return (
    <>
      <PageHeader
        title={title}
        subtitle={isStudent ? "Talabalar o'z guruhining jadvalini ko'radi" : "O'qituvchilarga login va parolni siz berasiz"}
        actions={
          <button className="btn btn-primary" onClick={() => setModal({ type: 'form', user: null })}>
            + {isStudent ? "Talaba qo'shish" : "O'qituvchi qo'shish"}
          </button>
        }
      />

      <div className="toolbar">
        <input
          className="search"
          placeholder="Ism yoki login bo'yicha qidirish…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {isStudent && (
          <select value={groupFilter} onChange={(e) => setGroupFilter(e.target.value)}>
            <option value="">Barcha guruhlar</option>
            {(groups.data || []).map((g) => (
              <option key={g._id} value={g._id}>
                {g.name}
              </option>
            ))}
          </select>
        )}
      </div>

      <StateView
        loading={users.loading && !users.data}
        error={users.error}
        onRetry={users.reload}
        empty={users.data && list.length === 0}
        emptyText={debounced || groupFilter ? 'Hech narsa topilmadi' : `Hali ${title.toLowerCase()} yo'q`}
      >
        <div className="card table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>F.I.Sh.</th>
                <th>Login</th>
                <th>{isStudent ? 'Guruh' : 'Kafedra'}</th>
                <th>Telefon</th>
                <th>Holat</th>
                <th className="right">Amallar</th>
              </tr>
            </thead>
            <tbody>
              {list.map((u) => (
                <tr key={u._id}>
                  <td>
                    <strong>{u.fullName}</strong>
                  </td>
                  <td>
                    <code>{u.username}</code>
                  </td>
                  <td>{isStudent ? u.group?.name || '—' : u.department || '—'}</td>
                  <td>{u.phone || '—'}</td>
                  <td>
                    <span className={`badge ${u.isActive ? 'badge-ok' : 'badge-off'}`}>
                      {u.isActive ? 'Faol' : 'Bloklangan'}
                    </span>
                  </td>
                  <td className="right actions">
                    <button className="btn btn-ghost sm" onClick={() => setModal({ type: 'reset', user: u })}>
                      Parol
                    </button>
                    <button className="btn btn-ghost sm" onClick={() => setModal({ type: 'form', user: u })}>
                      Tahrirlash
                    </button>
                    <button className="btn btn-ghost sm danger" onClick={() => remove(u)}>
                      O'chirish
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </StateView>

      {modal?.type === 'form' && (
        <UserFormModal
          kind={kind}
          user={modal.user}
          groups={groups.data || []}
          onClose={() => setModal(null)}
          onSaved={saved}
        />
      )}
      {modal?.type === 'reset' && (
        <ResetPasswordModal
          kind={kind}
          user={modal.user}
          onClose={() => setModal(null)}
          onDone={(user, password) => setModal({ type: 'creds', user, password })}
        />
      )}
      {modal?.type === 'creds' && (
        <CredentialsModal user={modal.user} password={modal.password} onClose={() => setModal(null)} />
      )}
    </>
  );
}
