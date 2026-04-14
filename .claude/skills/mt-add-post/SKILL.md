---
name: mt-add-post
description: 'URL processing workflow for Hugo blog newsletter posts. Use when user wants to add URLs to their newsletter, process blog content, extract content from links, or update daily newsletter posts. Automatically processes URLs, extracts content, generates Vietnamese summaries, and creates/updates daily newsletter posts with proper numbering and formatting.'
---

## Overview

This skill manages the complete workflow for adding newsletter posts to a Hugo blog with Vietnamese tech content.

**Project Context:**
- Type: Hugo static site with `hugo-theme-stack` theme
- Language: Vietnamese (99%) with minimal English tech terms (1%)
- Timezone: Asia/Ho_Chi_Minh (UTC+7)
- Content structure: `content/post/YYYY/MM/DD/index.md`

## Quick Workflow

```
1. Prepare URLs (clean → validate → check duplicates → classify)
2. Find today's post (create or update)
3. Determine newsletter number
4. Extract content and generate Vietnamese summaries
5. Write formatted content
6. Provide final report
```

## Step-by-Step Instructions

### 1. Prepare URLs

For each URL, run the bundled script:
```bash
node .claude/skills/mt-add-post/scripts/prepare-url.js "<url>"
```

The script handles:
- **Clean**: Remove tracking params (`utm_*`, `fbclid`, `gclid`, `msclkid`, `mc_eid`, `aid`, `ref`, `ref_src`, `source`, `s`, `ck_subscriber_id`, `igshid`, `yclid`, `vero_id`)
- **Validate**: Check accessibility (HTTP 200)
- **Check duplicate**: Compare by bare URL (scheme + host + path) — catches the same article even if previously saved with different tracking params
- **Classify**: Article (for main content) or asset (image/video/document → Bonus section)

**Skip** URLs that are: inaccessible, duplicates, or fail extraction.

### 2. Find Today's Post

Get current date in `YYYY-MM-DD` format (UTC+7).

Check if `content/post/YYYY/MM/DD/index.md` exists:
- **Exists** → Update this file
- **Not exists** → Create new with incremented newsletter number

### 3. Determine Newsletter Number

Run the bundled script:
```bash
node .claude/skills/mt-add-post/scripts/find-newsletter-number.js
```

This searches backwards from current date to find the most recent newsletter and returns the next number.

### 4. Generate Content

**For Article URLs:**
- Extract title and main content
- Generate Vietnamese summary (1-2 paragraphs, max 300 words)
- Optionally add 3-5 key points as bullets

**For Asset URLs** (images, videos, PDFs):
- Extract type and title
- Add to Bonus section

### 5. Write Content

**New Post Template:**
```markdown
---
title: "Newsletter #[number]"
date: YYYY-MM-DD
tags: ["AI-Assisted"]
categories: ["Newsletter"]
---

*Mời bạn thưởng thức Newsletter #[number].*

## [Article Title](clean_url)

[Vietnamese summary - professional, max 300 words]

**Điểm chính:**
- [Key point 1]
- [Key point 2]
```

**Update Existing Post** - insert new articles **before** the Bonus section:

To insert safely without clobbering the `### Bonus` heading, use an Edit that targets `### Bonus` as the anchor and prepends the new article:

```
old_string: "### Bonus"
new_string: "## [New Article Title](clean_url)\n\n[Summary paragraphs]\n\n**Điểm chính:**\n- [point 1]\n- [point 2]\n\n### Bonus"
```

Result:
```markdown
[Existing articles...]

## [New Article Title](clean_url)
[New summary...]

### Bonus

**Images:**
![image1](url1)
```

If the post has no `### Bonus` yet (first article of the day), append the article at end of file and do NOT create an empty Bonus section — add Bonus only when there's an asset to put in it.

**Bonus Section Format:**
```markdown
### Bonus

**Images:**
![title](url)

**Videos:**
[Video: title](url)

**Documents:**
[PDF: title](url)
```

## Language Guidelines

**Primary**: Vietnamese (99%) | **Secondary**: English (1% - unavoidable technical terms only)

**Allow English when no Vietnamese equivalent exists:**
- Technology names: AI, API, GitHub, Rust, Go, Docker, Kubernetes
- Database names: PostgreSQL, MongoDB, Redis
- Company names: Google, Microsoft, Databricks
- Acronyms: MCP, CI/CD, JSON, SQL, HTTP

**Always translate to Vietnamese:**
- Common terms: code → mã nguồn, software → phần mềm, deployment → triển khai, performance → hiệu năng
- Action verbs: use → sử dụng, check → kiểm tra, build → xây dựng, test → kiểm thử
- For any term not listed above: translate if a common Vietnamese equivalent exists

**Content Requirements:**
- Audience: Junior developers
- Tone: Professional, clear, accessible
- Verify content is ≥99% Vietnamese before saving

## Error Handling

| Issue | Action |
|-------|--------|
| URL inaccessible | Skip, note in report |
| Duplicate URL | Skip, note in report |
| Extraction fails | Skip, treat as error |
| Directory missing | Create directories |

## Final Report

```
✅ Newsletter Processing Complete

📄 File: content/post/YYYY/MM/DD/index.md
📊 Action: [Created new / Updated existing] Newsletter #[number]

✅ Processed: [count] URLs
   - [count] articles added
   - [count] assets added to Bonus

❌ Failed: [count] URLs
   - [url]: [reason]
```

## Checklist

Before finalizing, verify:
- [ ] Valid Hugo front matter with correct date format
- [ ] Title: `"Newsletter #[number]"`
- [ ] Tags include `"AI-Assisted"`
- [ ] URLs are clean (no tracking params)
- [ ] Vietnamese grammar is correct
- [ ] Articles appear before Bonus section
- [ ] Bonus assets grouped by type
