import { api } from '../../api/index.js';
import SimpleCrudPage from '../../components/SimpleCrudPage.jsx';

const config = {
  title: 'Fanlar',
  addLabel: "Fan qo'shish",
  api: api.subjects,
  emptyText: "Hali fan yo'q. Birinchi fanni qo'shing.",
  defaults: { name: '', isActive: true },
  fields: [{ name: 'name', label: 'Fan nomi', maxLength: 120 }],
  columns: [{ label: 'Fan', render: (s) => <strong>{s.name}</strong> }],
  deleteConfirm: (s) => `"${s.name}" fanini o'chirasizmi?`,
};

export default function Subjects() {
  return <SimpleCrudPage config={config} />;
}
