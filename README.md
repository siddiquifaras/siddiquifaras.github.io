# siddiquifaras.github.io

Personal site of Faras Siddiqui. Plain HTML and CSS with no build step. All content is in the HTML, so every page reads fully with scripts off, in search engines and in AI crawlers. The only JavaScript is a small inline script for the light/dark toggle, which stays hidden when scripts are off.

Live: [https://siddiquifaras.github.io](https://siddiquifaras.github.io)

## Structure

```
├── index.html          # Home: summary, selected work, experience, open source
├── work.html           # Experience in detail
├── projects.html       # TALON, frames2py, upstream pull requests
├── about.html          # Background, education, skills
├── contact.html        # Contact details and the booking calendar
├── blog.html           # Blog index
├── blog-*.html         # Blog posts
├── 404.html
├── *.html.md           # Markdown version of each page (llmstxt.org convention)
├── llms.txt            # Index and guidance for AI assistants
├── llms-full.txt       # Every page in one Markdown file
├── robots.txt          # Allows all crawlers, AI crawlers listed explicitly
├── sitemap.xml
├── styles.css
├── favicon.svg
├── images/             # Portrait, home photo, blog/ memes, og/ link-preview cards
├── files/              # CV (PDF)
└── frames2py.html, talon.html, bio.html, education.html, industry.html,
    pet-projects.html, publications.html   # Redirects from older URLs
```

Fonts: Source Serif 4, Inter and JetBrains Mono from Google Fonts.

## Editing

Each page's content lives in its `.html` file between `<main>` and `</main>`. When page content changes, update the matching `.html.md` file and `llms-full.txt` too, so the Markdown versions stay in step with the HTML.

## Local preview

```sh
python3 -m http.server 8000
```

Then open http://localhost:8000.

## License

© 2026 Faras Siddiqui. All rights reserved.
