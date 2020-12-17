import express from 'express';
import path from 'path';
import createError from 'http-errors';
import bodyParser from 'body-parser';
import configRouter from './routes/config';
import sitesRouter from './routes/sites';
import toolsRouter from './routes/tools';
import config from './config.json';

const app = express();

// app setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.locals.appName = config.appName;

app.use((req, res, next) => {
  app.locals.current = req.url;
  next();
});

// routes
const mainRouter = express.Router();
mainRouter.get('/', (req, res) => {
  res.redirect('/tool');
});
app.use('/', mainRouter);
app.use('/config', configRouter);
app.use('/tool', toolsRouter);
app.use('/site', sitesRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => next(createError(404)));

// error handler
app.use((error, req, res) => {
  // set locals, only providing error in development
  res.locals.message = error.message;
  res.locals.error = req.app.get('env') === 'development' ? error : {};

  // render the error page
  res.status(error.status || 500);
  res.render('error', { error });
});

module.exports = app;
