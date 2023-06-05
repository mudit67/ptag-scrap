require("dotenv").config();
const URL = process.env.URL;
const str = process.env.TAGS;
const Tags = str.split(",");
console.log(Tags);
