# siddiquifaras.github.io

Personal site of Faras Siddiqui, laid out like an encyclopedia article: contents rail, infobox, numbered sections and footnoted sources.

Live: [https://siddiquifaras.github.io](https://siddiquifaras.github.io)

## Structure

```
├── index.html               # Main article: experience, projects, open source, skills, education
├── frames2py.html           # Article on Frames2Py
├── talon.html               # Article on TALON and my work on it
├── contact.html             # Contact links and the Google Calendar booking page
├── 404.html                 # Not-found page
├── bio.html, education.html, industry.html,
│   pet-projects.html, publications.html   # Redirects from the old site's URLs
├── styles.css               # All styling (light theme)
├── script.js                # Contents rail, footnotes, hover previews, ⌘K search
├── favicon.svg
├── robots.txt, sitemap.xml
├── images/                  # Profile photo
└── files/                   # CV (PDF)
```

Plain HTML, CSS and JavaScript; no build step. Fonts come from Google Fonts (Newsreader, Inter, JetBrains Mono).

## Editing

- **Footnotes:** cite with `<sup class="ref"><a href="#ref-key"></a></sup>` and add `<li id="ref-key"><cite>…</cite></li>` to the page's `ol.references`. Numbers and back-links are assigned in order of first use when the page loads.
- **Contents rail:** built from every `h2[id]` and `h3[id]` inside `.article-body`.
- **Search and previews:** the page list, sections and quick actions live at the top of `script.js`.

## Local preview

```sh
python3 -m http.server 8000
```

Then open http://localhost:8000.

## License

© 2026 Faras Siddiqui. All rights reserved.
