const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const env = require('./config/env');
const routes = require('./routes');
const { notFound, errorHandler } = require('./middlewares/errorHandler');

const app = express();

app.disable('x-powered-by');
app.use(helmet());
app.use(
  cors({
    origin: (origin, cb) => {
      // origin yo'q bo'lsa (curl, Postman) ruxsat beramiz
      if (!origin || env.CLIENT_ORIGINS.includes(origin)) return cb(null, true);
      cb(new Error('CORS: bu manzilga ruxsat yo\'q'));
    },
    credentials: true,
  })
);
app.use(express.json({ limit: '100kb' }));
if (env.NODE_ENV !== 'test') app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));

app.use('/api', routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
