// require("dotenv").config();
import * as dotenv from "dotenv";
import fetch from "node-fetch";
// const cheerio = require("cheerio");
import * as cheerio from "cheerio";
dotenv.config();
import * as linksJson_ from "./data/links.json" assert { type: "json" };
import * as fs from "fs";
let linksJson = JSON.parse(JSON.stringify(linksJson_));
linksJson = linksJson.default;

let lastLink;

export default async function fetchUrls(URL, tags) {
  return new Promise(async (resolve_fetchUrls, reject) => {
    let linksObj,
      objIndex,
      resArray = [];
    let foundLinksObj = linksJson.filter((obj, index) => {
      if (
        obj.URL == URL &&
        tags.every(
          (i) => obj.tags.includes(i) && tags.length == obj.tags.length
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
      console.log("Links not found for this meta");
      objIndex = linksJson.length;
      linksObj = { URL: URL, tags: tags, links: [] };
    }
    const StartPage = 1;
    const Endpage = 1;
    for (let i = StartPage; i <= Endpage; i += 1) {
      console.log(`Current page: ${i}`);
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
      // console.log(`fetching: ${currentPageUrl}`);
      const pageHtmlText = await fetch(`${currentPageUrl}`).then((data) =>
        data.text()
      );

      let Urls = getLinks(pageHtmlText);

      let filteredLinks = await Promise.all(
        // Use map to return an array of promises not .filter()
        Urls.map(async ({ vidLink, imageLink }) => {
          {
            return await checkLink(vidLink, imageLink);
          }
        })
      ).then((i) => {
        resolve_fetchUrls(resArray);
        return i;
      });
      filteredLinks = filteredLinks.filter((link) => {
        return link !== false;
      });
      if (filteredLinks.length) {
        if (!filteredLinks.every((i) => linksObj.links.includes(i))) {
          let links = [...linksObj.links, ...filteredLinks];
          links = links.filter((i, index) => links.indexOf(i) == index);
          linksObj = { ...linksObj, links: links };
          linksJson[objIndex] = linksObj;
          fs.writeFile(
            "./data/links.json",
            JSON.stringify(linksJson),
            (err) => {
              if (err) {
                console.error(err);
                return;
              }
            }
          );
        }
      } else {
        console.log("No filtered links");
      }
    }
    function getLinks(htmlText) {
      let urlHtml = cheerio.load(htmlText);
      let vidUrls = [];
      const cards = urlHtml(".card.video")
        .get()
        .map((el) => {
          el = cheerio.load(el);
          let imageLink = el("img").attr("src");
          let vidLink = el(".title a").attr("href");
          if (vidLink) {
            imageLink = `https://daftsex.net${imageLink}`;
            vidLink = `https://daftsex.net${vidLink}`;
            vidUrls.push({ imageLink, vidLink });
          }
        });
      // urlHtml("h5.title a")
      //   .get()
      //   .map((el) => {
      //     const $el = urlHtml(el);
      //     vidUrls.push({
      //       vidLink: `https://daftsex.net${$el.attr("href")}`,
      //       imageLink: "",
      //     });
      //   });
      return vidUrls;
    }

    function checkLink(link, imageLink) {
      return new Promise(async (resolve, reject) => {
        console.log(`Fetching: ${(link, imageLink)}`);
        const data = await fetch(link)
          .then((a) => a.text())
          .catch((err) => {
            console.error(err);
          });
        const $vidPage = cheerio.load(data);
        const VidTitle = $vidPage("h1.title").text();
        const vidtags = $vidPage(".button.is-light.is-small.mb-1.ml-1")
          // .filter("[href=/videos/*]")
          .get()
          .map((el) => {
            const $el = $vidPage(el);
            return $el.text().trim();
          });
        if (tags.every((e) => vidtags.indexOf(e) >= 0)) {
          // link = `${link}`;
          lastLink = link;
          resArray.push({
            title: VidTitle,
            updatedTags: vidtags,
            link: link,
            imageLink,
          });
          console.log(`${link} added ${resArray.length}`);
          resolve(link);
        }
        resolve(false);
      });
    }
  });
}
