// require("dotenv").config();
import * as dotenv from "dotenv";
import fetch from "node-fetch";
// const cheerio = require("cheerio");
import * as cheerio from "cheerio";
dotenv.config();
import * as metaData_ from "./config/meta.json" assert { type: "json" };
let metaData = JSON.parse(JSON.stringify(metaData_));
metaData = metaData.default;
// console.log(`data: ${JSON.stringify(data)}`);
// const metaData = require("./config/meta.json");
// import "./config/meta.json" as metaData;
// fetch("./config/meta.json")
//   .then((res) => res.json())
//   .then(async (metaData) => {
console.log(`metaData: ${JSON.stringify(metaData)}`);

const URL = metaData.URL;
// const str = process.env.TAGS;
const Tags = metaData.Tags;
let lastLink;
const getLinks = (htmlText) => {
  let urlHtml = cheerio.load(htmlText);
  let vidUrls = [];
  urlHtml("h5.title a")
    .get()
    .map((el) => {
      const $el = urlHtml(el);
      vidUrls.push(`https://daftsex.net${$el.attr("href")}`);
    });
  return vidUrls;
};

function checkLink(link) {
  return new Promise(async (resolve, reject) => {
    const data = await fetch(link).then((a) => a.text());
    const $vidPage = cheerio.load(data);
    const vidTags = $vidPage(".button.is-light.is-small.mb-1.ml-1")
      // .filter("[href=/videos/*]")
      .get()
      .map((el) => {
        const $el = $vidPage(el);
        return $el.text().trim();
      });
    if (Tags.every((e) => vidTags.indexOf(e) >= 0)) {
      // console.log(link, vidTags);
      link = `\t\t ${link} \n`;
      lastLink = link;
      resolve(link);
      return link;
    }
    resolve(false);
  });
}

for (let i = 1; i <= Infinity; i += 1) {
  let currentPageUrl = "";
  if (
    URL.includes("search") ||
    URL.includes("model") ||
    URL.includes("channel")
  ) {
    currentPageUrl = `${URL}/&page=${i}`;
  } else {
    currentPageUrl = `${URL}/${i}`;
  }
  const pageHtmlText = await fetch(`${currentPageUrl}`).then((data) =>
    data.text()
  );

  let Urls = getLinks(pageHtmlText);

  let filteredLinks = await Promise.all(
    Urls.map((url) => {
      {
        return checkLink(url);
      }
    })
  );
  filteredLinks = filteredLinks.filter((link) => {
    return link !== false;
  });
  if (filteredLinks.length) {
    console.log(filteredLinks.join("\n"));
  }
  if (
    Urls.length == 0
    //  ||
    //  Urls.at(-1) == lastLink
  ) {
    break;
  }
}

// });
