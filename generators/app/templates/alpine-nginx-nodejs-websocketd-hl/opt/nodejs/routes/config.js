import express from 'express';
import fs from 'fs';

const configFilePath = '../data/config.json';
const configRouter = express.Router();

function getConfigFromFile() {
  let config = {};
  return new Promise(resolve => {
    fs.readFile(configFilePath, (error, data) => {
      if (!error) {
        resolve(JSON.parse(data));
      }
      resolve(config);
    });
  });
}

configRouter.get('/raw', async (req, res) => {
  const config = await getConfigFromFile();
  res.send(config);
});

configRouter.get('/', async (req, res) => {
  const config = await getConfigFromFile();
  res.render('config', { config });
});

configRouter.post('/', (req, res) => {
  fs.writeFile(configFilePath, JSON.stringify(req.body), async (error) => {
    if (error) {
      res.status(500);
      res.render('error', { ...error });
      return;
    }
    const config = await getConfigFromFile();
    res.render('config', { config });
  });
});

export default configRouter;
