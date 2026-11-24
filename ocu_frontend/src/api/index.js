import { request } from './client.js';

const crud = (base) => ({
  list: (query) => request('GET', base, { query }),
  create: (body) => request('POST', base, { body }),
  update: (id, body) => request('PATCH', `${base}/${id}`, { body }),
  remove: (id) => request('DELETE', `${base}/${id}`),
});

const userCrud = (base) => ({
  ...crud(base),
  resetPassword: (id, password) => request('PATCH', `${base}/${id}/password`, { body: { password } }),
});

export const api = {
  auth: {
    login: (username, password) => request('POST', '/auth/login', { body: { username, password } }),
    me: () => request('GET', '/auth/me'),
    changePassword: (currentPassword, newPassword) =>
      request('PATCH', '/auth/password', { body: { currentPassword, newPassword } }),
  },
  teachers: userCrud('/teachers'),
  students: userCrud('/students'),
  groups: crud('/groups'),
  subjects: crud('/subjects'),
  lessons: crud('/lessons'),
  schedule: {
    meta: () => request('GET', '/schedule/meta'),
    grid: (date) => request('GET', '/schedule/grid', { query: { date } }),
    my: () => request('GET', '/schedule/my'),
  },
};
