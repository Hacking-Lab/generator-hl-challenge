import express from 'express';
import config from '../config.json';

const toolsRouter = express.Router();

toolsRouter.get('/', (req, res) => {
  res.redirect('/tool/deploy');
});

toolsRouter.get('/deploy', (req, res) => {
  res.render('tool', {
    title: 'Deploy',
    websocketUri: `${config.wsUrl}/deploy`,
    verbose: config.verbose,
  });
});

toolsRouter.get('/destroy', (req, res) => {
  res.render('tool', {
    title: 'Destroy',
    websocketUri: `${config.wsUrl}/destroy`,
    verbose: config.verbose,
  });
});

toolsRouter.get('/log', (req, res) => {
  res.render('tool', {
    title: 'Log',
    websocketUri: `${config.wsUrl}/log`,
    verbose: config.verbose,
  });
});

toolsRouter.get('/ipaddresses', (req, res) => {
  res.render('tool', {
    title: 'IP Addresses',
    websocketUri: `${config.wsUrl}/ipaddresses`,
    verbose: config.verbose,
  });
});

export default toolsRouter;
