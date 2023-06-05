// require("dotenv").config();
import * as dotenv from "dotenv";
dotenv.config();
const URL = process.env.URL;
const str = process.env.TAGS;
const Tags = str.split(",");
import fetch from "node-fetch";
// const cheerio = require("cheerio");
import * as cheerio from "cheerio";
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
// fetch(URL)
//   .then((a) => a.text())
//   .then(async (htmlText) => {
//     let Urls = getLinks(htmlText);
//     // let filteredLinks = Promise.all(Urls.map((url) => filterLink(url)))
//     // let filteredLinks = Urls.filter(async function(url){

//     // });
//     // .filter(
//     //   (i) => !!i
//     // );
//     // console.log("filtered links: ", filteredLinks);

//     let filteredLinks = await Promise.all(
//       Urls.map((url) => {
//         {
//           return checkLink(url);
//         }
//       })
//     );
//     filteredLinks = filteredLinks.filter((link) => {
//       return link !== false;
//     });
//     console.log("filterLinksL: ", filteredLinks);
//   });
