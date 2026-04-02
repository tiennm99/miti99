#!/usr/bin/env node
// URL preparation script for mt-add-post skill
// Usage: node prepare-url.js "<url>"
// Outputs: JSON with status, clean_url, type, accessible, duplicate

const { execSync } = require("child_process");
const path = require("path");

const url = process.argv[2];
if (!url) {
  console.error("Usage: node prepare-url.js <url>");
  process.exit(1);
}

const PROJECT_ROOT = path.resolve(__dirname, "../../../..");

// Remove common tracking parameters
function cleanUrl(rawUrl) {
  try {
    const parsed = new URL(rawUrl);
    const trackingParams = [
      "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content",
      "fbclid", "gclid", "msclkid", "mc_eid",
    ];
    trackingParams.forEach((p) => parsed.searchParams.delete(p));
    return parsed.toString();
  } catch {
    // If URL parsing fails, do basic string cleanup
    return rawUrl.replace(/[?&](utm_[^&]*|fbclid|gclid|msclkid|mc_eid)[^&]*/g, "")
      .replace(/[?&]$/, "");
  }
}

// Check if URL is accessible (returns HTTP status code)
async function checkAccessibility(targetUrl) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    const res = await fetch(targetUrl, {
      method: "HEAD",
      redirect: "follow",
      signal: controller.signal,
    });
    clearTimeout(timeout);
    return res.status.toString();
  } catch {
    return "000";
  }
}

// Check if URL already exists in project content
function checkDuplicate(targetUrl) {
  try {
    const contentDir = path.join(PROJECT_ROOT, "content");
    execSync(`grep -rF "${targetUrl}" "${contentDir}"`, { stdio: "pipe" });
    return true;
  } catch {
    return false;
  }
}

// Classify URL type by extension
function classifyUrl(targetUrl) {
  const lower = targetUrl.toLowerCase();
  if (/\.(png|jpg|jpeg|gif|webp|svg)(\?.*)?$/.test(lower)) return "image";
  if (/\.(mp4|webm|mov|avi)(\?.*)?$/.test(lower)) return "video";
  if (/\.(pdf|doc|docx|xls|xlsx)(\?.*)?$/.test(lower)) return "document";
  return "article";
}

// Main
async function main() {
  const cleanedUrl = cleanUrl(url);
  const httpStatus = await checkAccessibility(cleanedUrl);
  const accessible = httpStatus === "200";
  const duplicate = checkDuplicate(cleanedUrl);
  const type = classifyUrl(cleanedUrl);

  console.log(JSON.stringify({
    original_url: url,
    clean_url: cleanedUrl,
    http_status: httpStatus,
    accessible,
    duplicate,
    type,
  }, null, 2));
}

main();
