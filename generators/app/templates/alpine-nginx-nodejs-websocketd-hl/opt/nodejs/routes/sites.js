import express from 'express';
import fetch from 'node-fetch';
import { Remarkable } from 'remarkable';
import configJson from '../config.json';

const sitesRouter = express.Router();

async function renderSite(res, title, site) {
  let markdown = 'No information found.';
  try {
    const response = await fetch(`${configJson.apiUrl}/${site}.md`);
    if (response.status === 200) {
      const content = await response.text();
      markdown = new Remarkable().render(content);
    }
  } catch (error) {
    markdown = error;
  }
  res.render('site', { title, markdown });
}

sitesRouter.get('/about', async (req, res) => {
  await renderSite(res, 'About', 'about');
});

sitesRouter.get('/readme', async (req, res) => {
  await renderSite(res, 'About', 'readme');
});

export default sitesRouter;
