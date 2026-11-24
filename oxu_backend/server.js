const env = require('./src/config/env');
const connectDB = require('./src/config/db');
const app = require('./src/app');

async function start() {
  await connectDB();
  const server = app.listen(env.PORT, () => {
    console.log(`Server ishga tushdi: http://localhost:${env.PORT}`);
  });

  const shutdown = (signal) => {
    console.log(`${signal} qabul qilindi, server to'xtatilmoqda...`);
    server.close(() => process.exit(0));
  };
  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

start().catch((err) => {
  console.error('Serverni ishga tushirib bo\'lmadi:', err.message);
  process.exit(1);
});
