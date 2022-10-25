require("dotenv").config();

const logger = require("morgan");
const express = require("express");
const errorHandler = require("errorhandler");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");

const fetch = require("node-fetch");

const app = express();
const path = require("path");
const { log } = require("console");
const { cp } = require("fs");
const port = 3000;

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride());
app.use(errorHandler());
app.use(express.static(path.join(__dirname, "../public")));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

const handleRequest = async (api) => {
  const data = await fetch(api);
  return data.json();
};

app.get("/", async (req, res) => {
  const filmsList = await getFilmsList();

  res.render("pages/index", { filmsList });
});

app.get("/films/:uid", async (req, res) => {
  const filmId = req.params.uid;
  const film = await getFilmById(filmId);

  const charactersList = await getCharactersList();
  const filmCharactersList = await sortCharactersByFilmId(charactersList, film);

  const locationsList = await getLocationsList();
  const filmLocationsList = await sortLocationsByFilmId(locationsList, film);

  res.render(`pages/detail`, { film, filmCharactersList, filmLocationsList });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

const api = "https://ghibliapi.herokuapp.com";

async function getFilmsList() {
  return await handleRequest(`${api}/films`);
}

async function getFilmById(filmId) {
  return await handleRequest(`${api}/films/${filmId}`);
}

async function getLocationsList() {
  return await handleRequest(`${api}/locations`);
}

async function sortLocationsByFilmId(locationsList, film) {
  const filmLocationList = [];
  locationsList.forEach((location) => {
    if (location.films[0] != film.url) {
      return;
    } else {
      filmLocationList.push(location);
    }
  });
  return filmLocationList.length > 0 ? filmLocationList : "No Data";
}

async function getCharactersList() {
  return await handleRequest(`${api}/people`);
}

async function sortCharactersByFilmId(charactersList, film) {
  const filmCharactersList = [];
  charactersList.forEach((character) => {
    if (character.films[0] != film.url) {
      return;
    } else {
      filmCharactersList.push(character);
    }
  });
  return filmCharactersList;
}
