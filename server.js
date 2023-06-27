import express from "express";
import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";
import bodyParser from "body-parser";
import fetchUrls from "./index.js";
const app = express();
const port = 5000;

// Retrieve the directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.use(express.static(path.join(__dirname, "vanilla_frontend")));

// Parse JSON request bodies
app.use(bodyParser.json());

// Route for serving the HTML file
app.get("/", async (req, res) => {
  res.sendFile(path.join(__dirname, "vanilla_frontend", "index.html"));
});

// Route for handling POST requests
app.post("/getLinks", async (req, res) => {
  const { url, tags, currentPage } = req.body;
  console.log(url);
  const fetchedLinks = await fetchUrls(url, tags, currentPage);
  if (fetchedLinks.err) {
    return res.status(400).json({ err: "No more pages" });
  }
  res.json(fetchedLinks);
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port} \n\n\n`);
});
