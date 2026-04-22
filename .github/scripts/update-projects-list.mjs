#!/usr/bin/env node
// Build a projects list (owned + contributed) and inject it into
// content/page/projects/index.md between the PROJECTS_LIST markers.
//
// A project is included if it has a URL, meaning either:
//   - repo.homepage is set, OR
//   - repo.has_pages is true (owned repos only — GraphQL does not expose
//     has_pages for contributed repos, so those must have homepage set).

import fs from "node:fs/promises";
import path from "node:path";

const token = process.env.GH_TOKEN;
const user = process.env.GH_USER;

if (!token || !user) {
  console.error("GH_TOKEN and GH_USER env vars are required");
  process.exit(1);
}

const restHeaders = {
  Authorization: `Bearer ${token}`,
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
  "User-Agent": `${user}-projects-updater`,
};

async function fetchOwnedRepos() {
  const all = [];
  for (let page = 1; page <= 20; page += 1) {
    const url = `https://api.github.com/users/${user}/repos?type=all&sort=updated&per_page=100&page=${page}`;
    const res = await fetch(url, { headers: restHeaders });
    if (!res.ok) {
      throw new Error(`REST /users/${user}/repos ${res.status}: ${await res.text()}`);
    }
    const batch = await res.json();
    if (!Array.isArray(batch) || batch.length === 0) break;
    all.push(...batch);
    if (batch.length < 100) break;
  }
  return all.map((r) => ({
    nameWithOwner: r.full_name,
    name: r.name,
    htmlUrl: r.html_url,
    description: r.description,
    homepage: r.homepage,
    hasPages: !!r.has_pages,
    owner: r.owner?.login,
    isOwned: true,
  }));
}

const CONTRIB_QUERY = `
query($login: String!, $cursor: String) {
  user(login: $login) {
    repositoriesContributedTo(
      first: 100
      after: $cursor
      includeUserRepositories: false
      privacy: PUBLIC
      contributionTypes: [COMMIT, PULL_REQUEST, PULL_REQUEST_REVIEW]
      orderBy: { field: UPDATED_AT, direction: DESC }
    ) {
      pageInfo { hasNextPage endCursor }
      nodes {
        nameWithOwner
        name
        url
        description
        homepageUrl
        owner { login }
      }
    }
  }
}`;

async function fetchContributedRepos() {
  const all = [];
  let cursor = null;
  for (let i = 0; i < 20; i += 1) {
    const res = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "User-Agent": `${user}-projects-updater`,
      },
      body: JSON.stringify({
        query: CONTRIB_QUERY,
        variables: { login: user, cursor },
      }),
    });
    if (!res.ok) {
      throw new Error(`GraphQL ${res.status}: ${await res.text()}`);
    }
    const body = await res.json();
    if (body.errors) {
      throw new Error(`GraphQL errors: ${JSON.stringify(body.errors)}`);
    }
    const node = body.data?.user?.repositoriesContributedTo;
    if (!node) break;
    for (const r of node.nodes) {
      all.push({
        nameWithOwner: r.nameWithOwner,
        name: r.name,
        htmlUrl: r.url,
        description: r.description,
        homepage: r.homepageUrl,
        hasPages: false, // not exposed via GraphQL; rely on homepage
        owner: r.owner.login,
        isOwned: false,
      });
    }
    if (!node.pageInfo.hasNextPage) break;
    cursor = node.pageInfo.endCursor;
  }
  return all;
}

function resolveUrl(repo) {
  const home = (repo.homepage || "").trim();
  if (home) return home;
  if (repo.hasPages && repo.isOwned) {
    return `https://${repo.owner}.github.io/${repo.name}`;
  }
  return null;
}

function toRow(repo, url) {
  const desc = (repo.description || "")
    .replace(/\|/g, "\\|")
    .replace(/\r?\n/g, " ")
    .trim();
  return `| [${repo.nameWithOwner}](${repo.htmlUrl}) | ${desc} | [${url}](${url}) |`;
}

const START = "<!-- PROJECTS_LIST_START -->";
const END = "<!-- PROJECTS_LIST_END -->";

function buildBlock(rows) {
  return [
    START,
    "",
    "| Name | Description | URL |",
    "| --- | --- | --- |",
    ...rows,
    "",
    END,
  ].join("\n");
}

async function main() {
  const [owned, contributed] = await Promise.all([
    fetchOwnedRepos(),
    fetchContributedRepos(),
  ]);

  const merged = new Map();
  for (const r of [...owned, ...contributed]) {
    if (!merged.has(r.nameWithOwner)) merged.set(r.nameWithOwner, r);
  }

  const rows = [];
  const sorted = [...merged.values()].sort((a, b) =>
    a.nameWithOwner.localeCompare(b.nameWithOwner),
  );
  for (const r of sorted) {
    const url = resolveUrl(r);
    if (!url) continue;
    rows.push(toRow(r, url));
  }

  const block = buildBlock(rows);
  const file = path.resolve("content/page/projects/index.md");
  const current = await fs.readFile(file, "utf8");
  const marker = /<!-- PROJECTS_LIST_START -->[\s\S]*?<!-- PROJECTS_LIST_END -->/;
  const next = marker.test(current)
    ? current.replace(marker, block)
    : `${current.trimEnd()}\n\n${block}\n`;

  if (next === current) {
    console.log(`No changes (${rows.length} projects).`);
    return;
  }
  await fs.writeFile(file, next);
  console.log(`Updated ${file} with ${rows.length} projects.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
