import "./style.scss";

import moment from "moment";

function getStoryById(id) {
  return fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then(
    (response) => response.json()
  );
}

function getRandomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function getTopStoriesArray() {
  return fetch("https://hacker-news.firebaseio.com/v0/topstories.json").then(
    (response) => response.json()
  );
}

function getItemsByLength(items, len = 10) {
  const set = new Set();

  while (set.size < len) {
    set.add(getRandomItem(items));
    if (set.size === len) break;
  }

  return Array.from(set);
}

function createArticle(result, count) {
  console.log(result);

  const article = document.createElement("article");
  article.classList.add("news");

  const counter = document.createElement("div");
  counter.classList.add("news-number");
  counter.innerText = `${count}.`;

  const content = document.createElement("div");
  content.classList.add("news-content");

  const title = document.createElement("a");
  title.classList.add("news-title");
  title.href = result.url || "#";

  if (result.url) {
    const url = new URL(result.url);
    // prettier-ignore
    title.innerHTML = `${result.title } <span class="news-title-url">(${url.host})</span>`
  } else {
    title.innerHTML = result.title;
  }

  const meta = document.createElement("div");
  meta.classList.add("news-meta");
  // prettier-ignore
  meta.innerHTML = `${result.score} points by <a href="#">${result.by}</a> | <a href="#">${moment.unix(result.time).fromNow()}</a> | <a href="#">hide</a> | <a href="#">${Array.isArray(result.kids) ? result.kids.length : 0} comments</a>`

  content.appendChild(title);
  content.appendChild(meta);

  article.appendChild(counter);
  article.appendChild(content);

  document.getElementById("news-items").appendChild(article);
}

async function onDocumentOnLoad() {
  const stories = await getTopStoriesArray();

  const items = getItemsByLength(stories, 10);

  const promises = items.map((id) => getStoryById(id));

  const results = await Promise.all(promises);

  results.forEach((result, i) => createArticle(result, i + 1));
}

window.addEventListener("DOMContentLoaded", onDocumentOnLoad);
