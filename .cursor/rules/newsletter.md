# Cursor Rules for Newsletter Management

## 1. URL Processing
When a URL is provided:
- Remove any tracking/metrics parameters (e.g., ?utm_source=, ?ref=)
- Keep the base URL clean and readable
- Preserve the original article title exactly as written

## 2. Newsletter Structure
### Front Matter (YAML)
```yaml
---
title: "Newsletter #[number]"
date: [current date]
tags: [ "AI-Assisted", [additional relevant tags] ]
categories: [ "Newsletter" ]
---
```

### Content Format
1. Intro text: "*Mời bạn thưởng thức Newsletter #[number].*"
2. Article sections:
   ```
   ## [Original Article Title](clean_url)
   
   [Vietnamese summary]
   
   [Optional bullet points for key takeaways]
   ```

## 3. Content Guidelines
- Summaries must be in Vietnamese
- Maintain professional tone
- Include key points in bullet format when appropriate
- Keep summaries concise but informative
- Add relevant tags based on article content
- Always include "AI-Assisted" tag

## 4. File Management
- Check if there's an open newsletter file
- If yes: append new content to existing file
- If no: create new file with proper structure
- Follow date-based directory structure: content/post/YYYY/MM/DD/index.md

## 5. Quality Checks
- Ensure proper markdown formatting
- Verify all links are clean and working
- Check for consistent Vietnamese language usage
- Maintain proper spacing between sections
- Validate YAML front matter structure

## 6. Example Format
```markdown
---
title: "Newsletter #16"
date: 2025-05-17
tags: [ "AI-Assisted", "Programming Languages" ]
categories: [ "Newsletter" ]
---

*Mời bạn thưởng thức Newsletter \#16.*

## [Article Title](https://clean-url.com)

[Vietnamese summary]

[Optional bullet points]
```

## 7. Error Prevention
- Always verify URL is accessible
- Check for duplicate articles
- Ensure proper date formatting
- Validate markdown syntax
- Maintain consistent formatting across all entries

## 8. Implementation Steps
1. When a URL is provided:
   - Clean the URL by removing tracking parameters
   - Fetch and analyze the content
   - Create a Vietnamese summary
   - Identify relevant tags

2. For new newsletters:
   - Create file in correct directory structure
   - Add proper front matter
   - Include intro text
   - Add article with summary

3. For existing newsletters:
   - Append new article to existing content
   - Maintain consistent formatting
   - Update tags if necessary

4. Final checks:
   - Verify all formatting
   - Check Vietnamese language quality
   - Ensure proper spacing
   - Validate all links 