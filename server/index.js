const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware : sert les fichiers statiques du dossier public
app.use(express.static(path.join(__dirname, "..", "/public")));

app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});