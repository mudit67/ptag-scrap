// require("dotenv").config();
import * as dotenv from "dotenv";
dotenv.config();
const URL = process.env.URL;
const str = process.env.TAGS;
const Tags = str.split(",");
console.log(Tags);
import fetch from "node-fetch";
// const cheerio = require("cheerio");
import * as cheerio from "cheerio";

fetch(URL)
  .then((a) => a.text())
  .then((htmlText) => {
    let Urls = getLinks(htmlText);
    let filteredLinks = Promise.all(Urls.map((url) => filterLink()));
  });

const getLinks = (htmlText) => {
  let urlHtml = cheerio.load(htmlText);
  let vidUrls = [];
  urlHtml("h5.title a")
    .get()
    .map((el) => {
      //   console.log(urlHtml(this).attr("href"));
      //   console.log(urlHtml(this).html());
      const $el = urlHtml(el);
      vidUrls.push(`https://daftsex.net${$el.attr("href")}`);
      // console.log($el.text(), $el.attr("href"));
    });
  return vidUrls;
};

async function filterLink(link) {}
