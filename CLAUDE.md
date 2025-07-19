# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Hugo-based static site blog (miti99.com) built with the hugo-theme-stack theme. The blog features Vietnamese content with a focus on technology newsletters, programming tutorials, and technical insights.

## Development Commands

### Build and Development
- **Local development server**: `hugo server --gc`
- **Production build**: `hugo --gc --minify`
- **Development with theme debugging**: `cd themes/hugo-theme-stack && ./debug.sh`

### Docker Commands
- **Build image**: `docker build -t miti99-blog .`
- **Run container**: `docker run -p 80:80 miti99-blog`

## Content Structure

### Blog Posts
- Posts are located in `content/post/YYYY/MM/DD/index.md`
- Each post follows Hugo front matter format with title, date, tags, and categories
- Images and assets are stored alongside posts in `img/` subdirectories
- Additional resources (PDFs, data files) stored in `doc/` and `data/` subdirectories

### Newsletter Posts
- Newsletter posts use a specific format with numbered titles (e.g., "Newsletter #26")
- Always include "AI-Assisted" tag and "Newsletter" category
- Content is written in Vietnamese with professional tone
- Follow the structure defined in `.cursor/rules/newsletter_processor.mdc`

### Content Creation Guidelines
- Use Vietnamese language for main content
- Keep technical terms in English when appropriate
- Include relevant tags (max 5 per post)
- Maintain consistent date format: YYYY-MM-DD
- Store assets in appropriate subdirectories within post folders

## Hugo Configuration

### Key Configuration Files
- `config/_default/hugo.yml` - Main Hugo configuration
- `config/_default/params.yml` - Theme parameters
- `config/_default/menu.yml` - Site navigation
- `config/_default/languages.yml` - Language settings

### Important Settings
- Base URL: https://miti99.com
- Language: Vietnamese (vi)
- Timezone: Asia/Ho_Chi_Minh
- Theme: hugo-theme-stack
- Pagination: 5 posts per page

## Newsletter Processing Workflow

The repository includes a Cursor rule for automated newsletter processing located in `.cursor/rules/newsletter_processor.mdc`. This rule:

1. Processes URLs to create/update newsletter posts
2. Removes tracking parameters from URLs
3. Creates Vietnamese summaries of articles
4. Maintains consistent formatting and structure
5. Auto-increments newsletter numbers
6. Handles date formatting and file organization

When working with newsletter content, follow the established pattern and ensure compliance with the processing rules.

## File Organization

- `content/` - All markdown content and assets
- `config/` - Hugo configuration files
- `layouts/` - Custom layout overrides
- `static/` - Static assets served at site root
- `themes/hugo-theme-stack/` - Theme files (do not modify directly)
- `public/` - Generated site output (ignored in development)

## Deployment

The site uses a multi-stage Docker build:
1. Build stage using Hugo v0.140.2 to generate static files
2. Runtime stage using nginx:alpine to serve content
3. Final image exposes port 80 for web traffic