# Skills Improvement Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix bugs and gaps in existing skills, improve tag quality, and add two new automation skills to cover the missing commit and batch-tagging workflows.

**Architecture:** All work targets `.claude/skills/` SKILL.md files and their bundled shell scripts. No application code is modified. Each task is self-contained — a skill can be tested independently using the `skill-creator:skill-creator` eval workflow.

**Tech Stack:** Hugo, bash shell scripts, YAML frontmatter, Claude Code skills system

---

## Chunk 1: Cleanup & Quick Fixes

### Task 1: Clean up accidental `.claire/` directory

**Files:**
- Delete: `.claire/` (entire directory — created by a typo in an eval agent path)
- Modify: `.gitignore`

- [ ] **Step 1: Verify `.claire/` is safe to delete**

```bash
ls -la .claire/
```
Expected: only eval output artifacts, nothing user-created.

- [ ] **Step 2: Delete the directory**

```bash
rm -rf .claire/
```

- [ ] **Step 3: Add entries to `.gitignore`**

Add to `.gitignore`:
```
.claire/
.claude/skills/mt-add-tags-workspace/
.claude/skills/mt-add-post-workspace/
```

- [ ] **Step 4: Verify clean status**

```bash
git status
```
Expected: `.claire/` gone, `.gitignore` modified.

- [ ] **Step 5: Commit**

```bash
git add .gitignore
git commit -m "chore: remove accidental .claire dir and gitignore skill workspaces"
```

---

### Task 2: Fix `mt:add-post` — Bonus section Vietnamese headers

**Files:**
- Modify: `.claude/skills/mt-add-post/SKILL.md` (Bonus Section Format block, ~line 108–119)

The current template uses English headers (`**Images:**`, `**Videos:**`, `**Documents:**`) but actual published posts use Vietnamese. Fix the template to match reality.

- [ ] **Step 1: Read the current template**

Open `.claude/skills/mt-add-post/SKILL.md` and find the "Bonus Section Format" block.

- [ ] **Step 2: Replace English headers with Vietnamese**

Change:
```markdown
**Images:**
![title](url)

**Videos:**
[Video: title](url)

**Documents:**
[PDF: title](url)
```

To:
```markdown
**Hình ảnh:**
![title](url)

**Video:**
[Video: title](url)

**Tài liệu:**
[PDF: title](url)
```

- [ ] **Step 3: Also fix the "Update Existing Post" example** in the same file (around the "Bonus" example block) — same English → Vietnamese swap.

- [ ] **Step 4: Verify no other English-header references remain**

```bash
grep -n "Images:\|Videos:\|Documents:" .claude/skills/mt-add-post/SKILL.md
```
Expected: no matches.

- [ ] **Step 5: Commit**

```bash
git add .claude/skills/mt-add-post/SKILL.md
git commit -m "fix(skills): use Vietnamese headers in mt:add-post bonus section template"
```

---

### Task 3: Fix `find_newsletter_number.sh` — timezone handling

**Files:**
- Modify: `.claude/skills/mt-add-post/scripts/find_newsletter_number.sh`

The script calls `date +%Y`, `date +%m`, `date +%d` without a timezone override. On non-VN machines this returns the wrong date.

- [ ] **Step 1: Read the current script**

Open `.claude/skills/mt-add-post/scripts/find_newsletter_number.sh` and find every call to `date`.

- [ ] **Step 2: Prefix all `date` calls with `TZ='Asia/Ho_Chi_Minh'`**

Change every occurrence of:
```bash
date +%Y
date +%m
date +%d
```
To:
```bash
TZ='Asia/Ho_Chi_Minh' date +%Y
TZ='Asia/Ho_Chi_Minh' date +%m
TZ='Asia/Ho_Chi_Minh' date +%d
```

Or if assigned to variables, e.g.:
```bash
CURRENT_YEAR=$(TZ='Asia/Ho_Chi_Minh' date +%Y)
CURRENT_MONTH=$(TZ='Asia/Ho_Chi_Minh' date +%m)
```

- [ ] **Step 3: Verify the script still runs**

```bash
bash .claude/skills/mt-add-post/scripts/find_newsletter_number.sh
```
Expected: prints a newsletter number (e.g. `88`), no errors.

- [ ] **Step 4: Commit**

```bash
git add .claude/skills/mt-add-post/scripts/find_newsletter_number.sh
git commit -m "fix(skills): add UTC+7 timezone to date calls in find_newsletter_number.sh"
```

---

### Task 4: Fix `mt:add-post` — add "suggest commit" at end of report

**Files:**
- Modify: `.claude/skills/mt-add-post/SKILL.md` (Final Report section)

After printing the processing report, the skill should suggest a commit message and ask if the user wants to commit now.

- [ ] **Step 1: Find the Final Report section in SKILL.md**

Locate the `## Final Report` section (template with ✅ Processing Complete).

- [ ] **Step 2: Append a "Next Step" block after the report template**

Add:
```markdown
## Next Step: Commit

After printing the report, suggest:

> "Bạn có muốn commit bây giờ không? Suggested message:
> `feat(newsletter): add Newsletter #[number]`
> [Y/n]"

If yes, run the `/commit` skill or remind the user to run `mt:commit-push`.
```

- [ ] **Step 3: Commit**

```bash
git add .claude/skills/mt-add-post/SKILL.md
git commit -m "feat(skills): suggest commit after mt:add-post completes"
```

---

## Chunk 2: Improve `mt:add-tags`

### Task 5: Tag normalization — check existing repo tags before proposing

**Files:**
- Modify: `.claude/skills/mt-add-tags/SKILL.md` (Step 4: Generate tags)

Before proposing new tags, the skill should scan the repo for existing tag usage to prefer consistent casing and spelling.

- [ ] **Step 1: Read the current Step 4 in `mt:add-tags/SKILL.md`**

- [ ] **Step 2: Add a "normalize against existing tags" sub-step before generating**

Insert before the "Good tags are:" guidance:

```markdown
### 4a. Scan existing tags for normalization

Before generating, run:
```bash
grep -rh "^tags:" content/post/ | tr ',' '\n' | grep -oP '(?<=")[^"]+(?=")' | sort | uniq -c | sort -rn | head -40
```

This shows the most-used tags. When your proposed tag matches an existing one (case-insensitive), use the existing casing. For example, if `Performance` appears 12 times and you'd write `performance`, use `Performance`.
```

- [ ] **Step 3: Update the "Avoid" list to include case variants**

Add to the Avoid list:
> - Tags that duplicate existing ones in different casing (check the scan output first)

- [ ] **Step 4: Commit**

```bash
git add .claude/skills/mt-add-tags/SKILL.md
git commit -m "feat(skills): add existing-tag normalization step to mt:add-tags"
```

---

### Task 6: Allow 8-10 tags for newsletter posts

**Files:**
- Modify: `.claude/skills/mt-add-tags/SKILL.md` (Step 4: Generate tags count rule)

Newsletter posts covering 6-10 articles are under-tagged with a hard 6-7 limit.

- [ ] **Step 1: Find the "Produce exactly 6-7 tags" rule**

- [ ] **Step 2: Replace with a content-type-aware rule**

Change:
```markdown
Produce exactly **6-7 tags**.
```

To:
```markdown
Produce **6-7 tags** for regular posts, **8-10 tags** for newsletter posts (title starts with "Newsletter #") since they cover multiple distinct topics.
```

- [ ] **Step 3: Update the Newsletter posts note at bottom of Step 4**

Change:
```markdown
**Newsletter posts** (title starts with "Newsletter #"): keep `AI-Assisted` and derive 5-6 tags from the main topics covered in that issue.
```

To:
```markdown
**Newsletter posts** (title starts with "Newsletter #"): keep `AI-Assisted` + `Newsletter` as anchors, then derive 6-8 tags from the main topics covered — one tag per major theme is the target, not one per article.
```

- [ ] **Step 4: Commit**

```bash
git add .claude/skills/mt-add-tags/SKILL.md
git commit -m "feat(skills): allow 8-10 tags for newsletter posts in mt:add-tags"
```

---

### Task 7: Fix proactive commit check to target only post files

**Files:**
- Modify: `.claude/skills/mt-add-tags/SKILL.md` (Proactive behavior section)

The current wording says "most recently modified post file" but could accidentally match config files.

- [ ] **Step 1: Find the "Proactive behavior" section**

- [ ] **Step 2: Make the file check specific**

Change:
```markdown
check the most recently modified post file
```

To:
```markdown
check the most recently modified `content/post/*/index.md` file:
```bash
git diff --name-only HEAD | grep "^content/post/" | head -1
```
If that returns nothing, check unstaged changes:
```bash
git status --short | grep "content/post/" | awk '{print $2}' | head -1
```
```

- [ ] **Step 3: Commit**

```bash
git add .claude/skills/mt-add-tags/SKILL.md
git commit -m "fix(skills): target only content/post files in mt:add-tags proactive commit check"
```

---

## Chunk 3: New Skills

### Task 8: Create `mt:commit-push` skill

**Files:**
- Create: `.claude/skills/mt-commit-push/SKILL.md`

This skill handles the end-of-session commit + push flow: detects what changed, checks tags, generates a conventional commit message, commits, and optionally pushes.

- [ ] **Step 1: Create the skill directory**

```bash
mkdir -p .claude/skills/mt-commit-push
```

- [ ] **Step 2: Write SKILL.md**

Create `.claude/skills/mt-commit-push/SKILL.md`:

```markdown
---
name: mt:commit-push
description: "End-of-session commit and push workflow for the Hugo blog. Use when the user wants to commit changes, says 'commit', 'push', 'done for today', or after finishing adding newsletter posts. Automatically detects changed post files, checks for minimal tags and offers to fix them, generates a conventional commit message, commits staged changes, and optionally pushes to origin."
---

## Overview

Handles the standard end-of-session git workflow: check → tag → commit → push.

## Workflow

### 1. Detect changed post files

```bash
git status --short | grep "content/post/"
```

List all new or modified post files. If none found, check for other staged changes and ask user what to commit.

### 2. Check tags on changed posts

For each changed `content/post/*/index.md`:
- Read frontmatter tags
- If tags are minimal (empty, or only `["AI-Assisted"]` or only `["Newsletter"]`):
  > "Post `[path]` chỉ có tags: [...]. Chạy mt:add-tags trước khi commit không? [Y/n]"
  - Default: **yes** → invoke `mt:add-tags` for that post, then return here
  - No → continue

### 3. Detect newsletter number (if applicable)

If any changed file has a title matching `Newsletter #N`, extract N for the commit message.

### 4. Generate commit message

**Newsletter post added/updated:**
```
feat(newsletter): add Newsletter #[N]
```

**Regular article post:**
```
feat(post): add "[post title]"
```

**Multiple posts:**
```
feat(newsletter): add Newsletter #[N] and #[M]
```

**Non-post changes only:**
```
chore: [describe changes]
```

Show the generated message and ask:
> "Commit với message: `[message]`? [Y/n]"

User may edit the message if they say no.

### 5. Stage and commit

Stage only the relevant files:
```bash
git add content/post/
git add [any other explicitly mentioned files]
git commit -m "[confirmed message]"
```

### 6. Push (optional)

After commit:
> "Push lên origin/main không? [Y/n]"

If yes:
```bash
git push origin main
```

Report the result.
```

- [ ] **Step 3: Verify the skill appears in the skills list**

Restart Claude Code session or check that the skill is discoverable.

- [ ] **Step 4: Commit**

```bash
git add .claude/skills/mt-commit-push/SKILL.md
git commit -m "feat(skills): add mt:commit-push skill for end-of-session git workflow"
```

---

### Task 9: Create `mt:backfill-tags` skill

**Files:**
- Create: `.claude/skills/mt-backfill-tags/SKILL.md`

Batch-tag multiple posts that have minimal/missing tags. Primary use case: 30+ newsletter posts from Dec 2025–Mar 2026 with only `["AI-Assisted"]`.

- [ ] **Step 1: Create the skill directory**

```bash
mkdir -p .claude/skills/mt-backfill-tags
```

- [ ] **Step 2: Write SKILL.md**

Create `.claude/skills/mt-backfill-tags/SKILL.md`:

```markdown
---
name: mt:backfill-tags
description: "Batch-add tags to multiple Hugo blog posts that have missing or minimal tags. Use when the user wants to tag multiple posts at once, mentions 'backfill tags', 'tag all posts', or wants to clean up posts that only have AI-Assisted. Finds all posts matching a filter (date range or minimal-tags criteria), generates tags for each, asks for confirmation per post or in bulk, and writes the updates."
---

## Overview

Retroactively adds proper tags to posts that were published with minimal tagging (e.g., only `["AI-Assisted"]`).

## Workflow

### 1. Find posts to tag

Default filter: find all posts where `tags` has 2 or fewer entries.

```bash
grep -rl "^tags:" content/post/ | xargs grep -l "^\(tags: \[\"AI-Assisted\"\]\|tags: \[ \"AI-Assisted\" \]\)" | sort
```

If the user specifies a date range (e.g., "tag all posts from 2026"), filter accordingly:
```bash
find content/post/2026 -name "index.md" | sort
```

Show the user the list:
> "Tìm thấy [N] posts cần thêm tags. Bắt đầu không? [Y/n]"

### 2. Process each post

For each post in the list, follow the `mt:add-tags` workflow (Steps 2–6):
- Read existing tags
- Analyze content
- Generate 6-7 tags (8-10 for newsletters)
- Normalize against existing repo tags

### 3. Confirmation modes

Ask the user at start which mode they prefer:

**Mode A — Confirm each post individually** (default for ≤10 posts):
> "Post `[path]` — Đề xuất tags: [...]. Áp dụng không? [Y/n/skip/stop]"

**Mode B — Bulk confirm** (suggested for >10 posts):
> Show all proposed tags at once in a table, then:
> "Áp dụng tất cả [N] posts? [Y/n] hoặc nhập số thứ tự để bỏ qua"

### 4. Write updates

For each confirmed post, update the `tags:` line in frontmatter.
Keep a running count: "Đã cập nhật [K]/[N] posts."

### 5. Final report

```
✅ Backfill hoàn tất

📊 Đã cập nhật: [N] posts
⏭️ Bỏ qua: [M] posts
```

Suggest committing:
> "Commit tất cả thay đổi tags không? [Y/n]"
If yes, use: `chore(tags): backfill tags for [N] posts`
```

- [ ] **Step 3: Commit**

```bash
git add .claude/skills/mt-backfill-tags/SKILL.md
git commit -m "feat(skills): add mt:backfill-tags skill for bulk retroactive tagging"
```

---

## Summary

| Task | Skill | Type | Priority |
|------|-------|------|----------|
| 1 | — | Cleanup `.claire/` + gitignore | High |
| 2 | `mt:add-post` | Fix Vietnamese bonus headers | High |
| 3 | `mt:add-post` | Fix timezone in shell script | High |
| 4 | `mt:add-post` | Suggest commit at end | Medium |
| 5 | `mt:add-tags` | Tag normalization vs repo | High |
| 6 | `mt:add-tags` | Allow 8-10 tags for newsletters | Medium |
| 7 | `mt:add-tags` | Fix proactive file detection | Medium |
| 8 | `mt:commit-push` | New skill — git end-of-session | High |
| 9 | `mt:backfill-tags` | New skill — batch retroactive tags | Medium |
