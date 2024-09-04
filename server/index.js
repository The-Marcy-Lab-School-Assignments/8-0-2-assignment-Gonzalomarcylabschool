require('dotenv').config();
const fetchData = require('./utils/fetchData');
const express = require('express');
const path = require('path');

const pathToDistFolder = path.join(__dirname, '..', 'giphy-search', 'dist');

const app = express();

const serveStatic = express.static(pathToDistFolder);

const logRoutes = (req, res, next) => {
  const time = (new Date()).toLocaleString();
  console.log(`${req.method}: ${req.originalUrl} - ${time}`);
  next();
};

const serveGifs = async (req, res) => {
  const API_KEY = process.env.API_KEY;
  const query = req.query.q;
  const url = !query
    ? `https://api.giphy.com/v1/gifs/trending?api_key=${API_KEY}&limit=25&rating=g`
    : `https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&q=${query}&limit=3&rating=g`;

  try {
    // console.log(`Fetching data from ${url}`);
    const [data, error] = await fetchData(url);
    res.send(data);
  } catch (error) {
    console.error(error);
    res.sendStatus(404);
  }
}

app.use(logRoutes);
app.use(serveStatic);

app.get('/api/gifs', serveGifs);

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server is now running on http://localhost:${port}`);
});