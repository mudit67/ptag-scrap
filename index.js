// require("dotenv").config();
import * as dotenv from "dotenv";
dotenv.config();
const URL = process.env.URL;
const str = process.env.TAGS;
const Tags = str.split(",");
import fetch from "node-fetch";
// const cheerio = require("cheerio");
import * as cheerio from "cheerio";

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
      resolve(link);
      return link;
    }
    resolve(false);
  });
}

for (let i = 1; i <= Infinity; i += 1) {
  const pageHtmlText = await fetch(`${URL}/&page=${i}`).then((data) =>
    data.text()
  );

  let Urls = getLinks(pageHtmlText);
  if (Urls.length == 0) {
    break;
  }
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
  console.log(filteredLinks.join("\n"));
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
