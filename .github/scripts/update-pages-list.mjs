#!/usr/bin/env node
// Fetch all repos for $GH_USER with has_pages=true and inject a markdown
// table into content/page/pages/index.md between the PAGES_LIST markers.

import fs from "node:fs/promises";
import path from "node:path";

const token = process.env.GH_TOKEN;
const user = process.env.GH_USER;

if (!token || !user) {
  console.error("GH_TOKEN and GH_USER env vars are required");
  process.exit(1);
}

const headers = {
  Authorization: `Bearer ${token}`,
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
  "User-Agent": `${user}-pages-updater`,
};

async function fetchAllRepos() {
  const all = [];
  for (let page = 1; page <= 20; page += 1) {
    const url = `https://api.github.com/users/${user}/repos?type=all&sort=updated&per_page=100&page=${page}`;
    const res = await fetch(url, { headers });
    if (!res.ok) {
      const body = await res.text();
      throw new Error(`GitHub API ${res.status} ${res.statusText}: ${body}`);
    }
    const batch = await res.json();
    if (!Array.isArray(batch) || batch.length === 0) break;
    all.push(...batch);
    if (batch.length < 100) break;
  }
  return all;
}

function toRow(repo) {
  const pagesUrl =
    repo.homepage && repo.homepage.trim().length > 0
      ? repo.homepage.trim()
      : `https://${user}.github.io/${repo.name}`;
  const description = (repo.description || "")
    .replace(/\|/g, "\\|")
    .replace(/\r?\n/g, " ")
    .trim();
  return `| [${repo.name}](${repo.html_url}) | ${description} | [${pagesUrl}](${pagesUrl}) |`;
}

const START = "<!-- PAGES_LIST_START -->";
const END = "<!-- PAGES_LIST_END -->";

function buildBlock(rows) {
  return [
    START,
    "",
    "| Name | Description | Pages URL |",
    "| --- | --- | --- |",
    ...rows,
    "",
    END,
  ].join("\n");
}

async function main() {
  const repos = await fetchAllRepos();
  const pages = repos
    .filter((r) => r.has_pages)
    .sort((a, b) => a.name.localeCompare(b.name));

  const rows = pages.map(toRow);
  const block = buildBlock(rows);

  const file = path.resolve("content/page/pages/index.md");
  const current = await fs.readFile(file, "utf8");

  const marker = /<!-- PAGES_LIST_START -->[\s\S]*?<!-- PAGES_LIST_END -->/;
  const next = marker.test(current)
    ? current.replace(marker, block)
    : `${current.trimEnd()}\n\n${block}\n`;

  if (next === current) {
    console.log(`No changes (${pages.length} pages).`);
    return;
  }

  await fs.writeFile(file, next);
  console.log(`Updated ${file} with ${pages.length} pages.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
