require("dotenv").config();

const express = require("express");
const hbs = require("hbs");

// require spotify-web-api-node package here:

const spotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// setting the spotify-api goes here:
const spotifyApi = new spotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

// Our routes go here:

app.get("/", async (req, res) => {
  res.render("homepage");
});

app.get("/artist-search", async (req, res) => {
  //console.log(req.query);
  spotifyApi
    .searchArtists(req.query.artistName)
    .then((data) => {
      //console.log("The received data from the API: ", data.body.artists.items);
      //console.log(data.body.artists.items);
      const artistItem = data.body.artists.items;

      res.render("artist-search-results", { items: artistItem });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get("/albums/:id", (req, res, next) => {
  spotifyApi.getArtistAlbums(req.params.id).then(
    function (data) {
      //console.log(data.body.items);
      const albumsData = data.body.items;
      res.render("albums", { albums: albumsData });
    },
    function (err) {
      console.err(err);
    }
  );
  //const artistAlbums = data.
});
app.get("/track/:id", (req, res, next) => {
  spotifyApi.getAlbumTracks(req.params.id).then(
    function (data) {
      console.log(data.body.items);
      const trackData = data.body.items;
      res.render("track", { track: trackData });
    },
    function (err) {
      console.log("Something went wrong!", err);
    }
  );
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
