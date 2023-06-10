// require("dotenv").config();
import * as dotenv from "dotenv";
import fetch from "node-fetch";
// const cheerio = require("cheerio");
import * as cheerio from "cheerio";
dotenv.config();
import * as metaData_ from "./config/meta.json" assert { type: "json" };
import * as linksJson_ from "./data/links.json" assert { type: "json" };
import * as fs from "fs";
let metaData = JSON.parse(JSON.stringify(metaData_));
metaData = metaData.default;
let linksJson = JSON.parse(JSON.stringify(linksJson_));
linksJson = linksJson.default;
let linksObj, objIndex;
let foundLinksObj = linksJson.filter((obj, index) => {
  if (
    obj.URL == metaData.URL &&
    metaData.Tags.every(
      (i) => obj.Tags.includes(i) && metaData.Tags.length == obj.Tags.length
    )
  ) {
    objIndex = index;
    return true;
  }
});
if (foundLinksObj && foundLinksObj.length) {
  console.log("Links objext found");
  linksObj = foundLinksObj[0];
} else {
  console.log("Links object not found");
  objIndex = linksJson.length;
  linksObj = { URL: metaData.URL, Tags: metaData.Tags, links: [] };
  // console.log(Array.isArray(linksObj));
}

console.log(metaData, "\n\n\n");

const URL = metaData.URL;
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
      // link = `${link}`;
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
    if (!filteredLinks.every((i) => linksObj.links.includes(i))) {
      // console.log("New Links found: ");
      let links = [...linksObj.links, ...filteredLinks];
      links = links.filter((i, index) => links.indexOf(i) == index);
      linksObj = { ...linksObj, links: links };
      linksJson[objIndex] = linksObj;
      // console.log(
      // "🚀 ~ file: index.js:104 ~ linksJson:"
      // linksJson,
      // Array.isArray(linksJson)
      // );

      // fs.writeFileSync("./data/links.json", JSON.stringify(linksJson));
      fs.writeFile("./data/links.json", JSON.stringify(linksJson), (err) => {
        if (err) {
          console.log(err);
          return;
        }
        // console.log("No error found!");
      });
    } else {
      // console.log(
      //   "No new links found!",
      //   linksObj.links,
      //   linksObj.links.every((i) => filteredLinks.includes(i))
      // );
    }
    console.log("\t\t", filteredLinks.join("\n\t\t"));
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
