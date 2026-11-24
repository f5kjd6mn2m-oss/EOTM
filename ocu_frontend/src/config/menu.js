// Bitta sidebar — bo'limlar rolga qarab ochiladi
export const MENU = [
  { to: '/admin/schedule', label: 'Dars jadvali', icon: '▦', roles: ['admin'] },
  { to: '/admin/teachers', label: "O'qituvchilar", icon: '👤', roles: ['admin'] },
  { to: '/admin/students', label: 'Talabalar', icon: '🎓', roles: ['admin'] },
  { to: '/admin/groups', label: 'Guruhlar', icon: '👥', roles: ['admin'] },
  { to: '/admin/subjects', label: 'Fanlar', icon: '📘', roles: ['admin'] },
  { to: '/teacher/schedule', label: 'Mening darslarim', icon: '▦', roles: ['teacher'] },
  { to: '/student/schedule', label: 'Dars jadvali', icon: '▦', roles: ['student'] },
  { to: '/profile', label: 'Profil', icon: '⚙', roles: ['admin', 'teacher', 'student'] },
];

export const ROLE_LABEL = { admin: 'Administrator', teacher: "O'qituvchi", student: 'Talaba' };
