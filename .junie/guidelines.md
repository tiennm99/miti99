# Development Guidelines for miti99 Blog

This document provides guidelines and instructions for developing and maintaining the [miti99 blog](https://miti99.com).

## Build/Configuration Instructions

### Prerequisites

- [Hugo Extended](https://gohugo.io/installation/) v0.140.2 or later
- Git (for version control and submodule management)

### Local Development Setup

1. **Clone the repository with submodules**:
   ```bash
   git clone --recurse-submodules https://github.com/yourusername/miti99.git
   cd miti99
   ```

2. **Start the Hugo development server**:
   ```bash
   hugo server -D
   ```
   This will start a local development server at http://localhost:1313/ with live reload enabled.

3. **Build the site for production**:
   ```bash
   hugo --minify
   ```
   This will generate the static site in the `public/` directory.

### Configuration Files

The site configuration is split into multiple YAML files in the `config/_default/` directory:

- `hugo.yml` - Main Hugo configuration
- `params.yml` - Site parameters
- `menu.yml` - Navigation menu configuration
- `markup.yml` - Content markup settings
- `languages.yml` - Multilingual settings
- And several other configuration files for specific features

### Docker Deployment

The project includes a Dockerfile for containerized deployment:

```bash
# Build the Docker image
docker build -t miti99-blog .

# Run the container
docker run -p 80:80 miti99-blog
```

## Testing Information

### Manual Testing

To test the Hugo site manually:

1. **Build Verification**:
   ```powershell
   # Build the site
   hugo --minify

   # Check if the build was successful and index.html exists
   if (Test-Path "public\index.html") {
       Write-Host "Build successful!"
   }
   ```

2. **Link Checking**:
   You can use online tools or browser extensions to check for broken links after deploying your site.

### Adding New Tests

When creating tests for the Hugo site, follow these guidelines:

1. Use PowerShell for Windows compatibility
2. Include clear output messages with PASS/FAIL indicators
3. Return appropriate exit codes (0 for success, non-zero for failure)
4. Test both build functionality and content integrity

Example of a test script structure:

```powershell
# Test description
Write-Host "Starting test..."

# Test logic
$result = # Your test logic here

# Report results
if ($result) {
    Write-Host "Test passed - PASS"
    exit 0
} else {
    Write-Host "Test failed - FAIL"
    exit 1
}
```

## CI/CD Pipeline

The project uses GitHub Actions for CI/CD, defined in `.github/workflows/hugo.yml`:

1. **Build**: Builds the site using Hugo v0.140.2
2. **Deploy to GitHub Pages**: Deploys the built site to GitHub Pages
3. **Deploy to CloudFlare Pages**: Deploys the built site to CloudFlare Pages
4. **Submit to IndexNow**: Submits the sitemap to search engines via IndexNow

The workflow uses caching to speed up builds and is triggered on pushes to the main branch.

## Content Management

### Adding New Posts

1. Create a new directory in `content/post/YYYY/MM/DD/` with an `index.md` file
2. Add front matter with title, date, tags, etc.
3. Write your content in Markdown
4. Place images inside the `img` folder
5. Place documentation files inside the `doc` folder

Example front matter:

```yaml
---
title: "Your Post Title"
date: 2025-05-10T10:00:00+07:00
draft: false
tags: ["tag1", "tag2"]
categories: ["category"]
---
```

### Handling URLs for Blog Posts

When receiving only a URL:
1. Write an introduction in Vietnamese for the blog post linked by the URL
2. The introduction should be in a professional style
3. Common English words familiar to senior developers can be retained
4. If a post file is already open, add the introduction to that file
5. If no post file is open, create a new file with the current date and add the introduction there
6. The introduction must be placed before any bonus sections in the post

### Code Style and Conventions

- Post file name should be just `index.md`
- Use YAML for front matter
- Place images inside the `img` folder
- Place documentation files inside the `doc` folder
- Use relative links for internal content
- Follow the Hugo content organization structure

## Additional Development Information

### Theme Customization

The site uses the [Hugo Theme Stack](https://github.com/CaiJimmy/hugo-theme-stack) as a Git submodule. To customize the theme:

1. **Override theme templates**: Create corresponding files in the `layouts/` directory
2. **Override theme styles**: Create custom CSS in the `assets/scss/custom.scss` file
3. **Override theme parameters**: Modify the `params.yml` configuration file

### Performance Optimization

- Use Hugo's image processing for responsive images
- Minimize JavaScript and CSS with the `--minify` flag
- Use Hugo's asset pipeline for bundling and fingerprinting
- Enable HTTP/2 on your server for better performance

### Troubleshooting Common Issues

- **Submodule issues**: If the theme is missing, run `git submodule update --init --recursive`
- **Build errors**: Check the Hugo version (should be v0.140.2 or later)
- **Deployment issues**: Verify the GitHub Actions workflow has the correct permissions
