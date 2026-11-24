# ocu_frontend — Dars jadvali (React + Vite)

```bash
npm install
npm run dev        # http://localhost:5173  (/api so'rovlari backendga 5000-portga proxy qilinadi)
npm run build      # production uchun dist/ papkasi
```

Production'da backend boshqa domenda bo'lsa `.env` ga `VITE_API_URL=https://.../api` yozing va backenddagi `CLIENT_ORIGIN` ga frontend manzilini qo'shing.

## Sahifalar (bitta sidebar, bo'limlar rolga qarab chiqadi)

- **Admin**: Dars jadvali (o'qituvchilar × paralar, faqat Kecha / Bugun tanlanadi; dars bor katak qizil; katakni bosib dars biriktirish/ko'rish/o'zgartirish/o'chirish), O'qituvchilar (login/parol berish), Talabalar, Guruhlar, Fanlar
- **Teacher**: Mening darslarim (joriy hafta, sana bo'yicha)
- **Student**: o'z guruhining dars jadvali
- Hammada: Profil (parolni o'zgartirish)

## Tuzilma

```
src/
  api/          client.js (fetch + token), index.js (endpointlar)
  context/      AuthContext.jsx
  config/       menu.js (sidebar bo'limlari va rollar)
  hooks/        useLoad.js
  components/   Layout, Sidebar, Modal, Toast, LessonModal, UsersPage, SimpleCrudPage, WeeklySchedule ...
  pages/        Login, Profile, MySchedule, admin/{ScheduleGrid, Groups, Subjects}
```
