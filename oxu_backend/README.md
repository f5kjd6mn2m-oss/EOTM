# oxu_backend — Dars jadvali (Node.js + Express + MongoDB Atlas)

## Ishga tushirish

```bash
npm install
cp .env.example .env      # MONGO_URI va JWT_SECRET ni to'ldiring
npm run seed              # birinchi admin (login/parol .env dan)
npm run seed:demo         # ixtiyoriy: namunaviy guruh, fan, o'qituvchi, dars
npm run dev               # http://localhost:5000
```

MongoDB Atlas: **Network Access** bo'limida o'z IP manzilingizni qo'shing, **Database Access** da foydalanuvchi yarating.

## Tuzilma

```
server.js                  kirish nuqtasi (DB ulanish + listen)
src/
  app.js, routes.js        Express sozlamalari va marshrutlar
  config/                  env, db, constants (rollar, hafta kunlari, para vaqtlari)
  models/                  User, Group, Subject, Lesson (schemalar)
  middlewares/             auth (JWT), role, validate (zod), errorHandler, rateLimit
  utils/                   ApiError, asyncHandler, token, validators
  modules/
    auth/      teachers/   students/   groups/   subjects/   lessons/   schedule/
      *.routes.js  *.controller.js  *.service.js  *.validation.js
  seed/seedAdmin.js
```

## Rollar va ruxsatlar

| Modul | admin | teacher | student |
|---|---|---|---|
| `/api/auth/*` | ✅ | ✅ | ✅ |
| `/api/teachers`, `/students`, `/groups`, `/subjects`, `/lessons` | ✅ | ❌ | ❌ |
| `GET /api/schedule/grid?date=YYYY-MM-DD` (o'qituvchilar × paralar) | ✅ | ❌ | ❌ |
| `GET /api/schedule/my` | ❌ | o'z darslari | guruhining darslari |
| `GET /api/schedule/meta` | ✅ | ✅ | ✅ |

## Asosiy endpointlar

- `POST /api/auth/login` `{username, password}` → `{token, user}`
- `POST /api/teachers` `{fullName, username, password}` — admin o'qituvchiga login/parol beradi
- `PATCH /api/teachers/:id/password` `{password}` — parolni qayta o'rnatish
- `POST /api/lessons` `{date: "YYYY-MM-DD", pair: 1-6, group, subject, teacher, room?}` — dars biriktirish
- `GET /api/schedule/grid?date=2026-11-19` — har bir o'qituvchi uchun paralar katagi (`lesson: null` — bo'sh)

## Muhim qoidalar

- Dars **aniq sanaga** bog'langan (`date` + para). Dars qo'shish, o'zgartirish va o'chirish **faqat kecha va bugun** uchun mumkin; boshqa sanalar `400` xato qaytaradi, eski darslar qulflanadi. "Bugun" `APP_TIMEZONE` (standart `Asia/Tashkent`) bo'yicha hisoblanadi. Oraliq va para vaqtlari `src/config/constants.js` da.
- Teacher va student joriy hafta (Dushanba–Yakshanba) darslarini ko'radi.
- **Eski bazadan o'tish:** avval hafta kuni bilan dars yaratgan bo'lsangiz, `npm run seed` ni qayta ishga tushiring — eski darslar o'chiriladi va indekslar yangilanadi.
- Bir o'qituvchi yoki bir guruh bir vaqtda faqat bitta darsda bo'la oladi: servis aniq xabar qaytaradi (`409`), bazada esa unique indekslar kafolatlaydi.
- Parollar bcrypt bilan hash qilinadi, JWT `Authorization: Bearer <token>` orqali yuboriladi.
- Guruh/fan/o'qituvchini darsi bor bo'lsa o'chirib bo'lmaydi (avval darslarni olib tashlash kerak).
