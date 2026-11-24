import { api } from '../../api/index.js';
import SimpleCrudPage from '../../components/SimpleCrudPage.jsx';

const config = {
  title: 'Guruhlar',
  addLabel: "Guruh qo'shish",
  api: api.groups,
  emptyText: "Hali guruh yo'q. Birinchi guruhni qo'shing.",
  defaults: { name: '', course: 1, isActive: true },
  fields: [
    { name: 'name', label: 'Guruh nomi (masalan: 101-guruh)', maxLength: 40 },
    { name: 'course', label: 'Kurs (1–6)', type: 'number', min: 1, max: 6 },
  ],
  columns: [
    { label: 'Guruh', render: (g) => <strong>{g.name}</strong> },
    { label: 'Kurs', render: (g) => g.course },
    { label: 'Talabalar', render: (g) => g.studentsCount },
  ],
  deleteConfirm: (g) => `"${g.name}" guruhini o'chirasizmi?`,
};

export default function Groups() {
  return <SimpleCrudPage config={config} />;
}
