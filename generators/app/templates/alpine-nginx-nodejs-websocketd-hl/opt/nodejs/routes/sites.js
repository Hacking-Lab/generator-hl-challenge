import express from 'express';
import fetch from 'node-fetch';
import { Remarkable } from 'remarkable';
import configJson from '../config.json';

const sitesRouter = express.Router();

sitesRouter.get('/about', async (req, res) => {
  let markdown = 'No information found.';
  try {
    const response = await fetch(`${configJson.apiUrl}/about`);
    const parsed = await response.json();
    markdown = new Remarkable().render(parsed.markdown);
  } catch (error) {
    markdown = error;
  }
  res.render('site', { title: 'About', markdown });
});

sitesRouter.get('/readme', async (req, res) => {
  let markdown = 'No information found.';
  try {
    const response = await fetch(`${configJson.apiUrl}/readme`);
    const parsed = await response.json();
    markdown = new Remarkable().render(parsed.markdown);
  } catch (error) {
    markdown = error;
  }
  res.render('site', { title: 'Readme', markdown });
});

export default sitesRouter;
