# Developer Portfolio - Multi-page Website Template

A free, responsive developer portfolio built with plain HTML5, CSS3 and JavaScript. No frameworks, no build step. It includes project case studies, a blog, services, a printable resume, testimonials and a light and dark theme.

![Preview](preview.png)

**[Live demo](https://lenivalestevao.github.io/developer-portfolio-landing-page/)**

## Pages

All pages run in a single `index.html` and are routed with the URL hash (for example `#/projects`), so it works on any static host such as GitHub Pages.

| Page | Route | What it does |
| --- | --- | --- |
| Home | `#/` | Hero with code card, animated stats, about, skill bars, projects carousel, experience, testimonials carousel, latest posts, call to action |
| Projects | `#/projects` | Search and Web, Mobile and API filters |
| Case study | `#/project/1` | Problem, solution, results, facts and previous/next links |
| About | `#/about` | Story, values and tech stack |
| Skills | `#/skills` | Animated skill bars by area |
| Experience | `#/experience` | Full timeline and education |
| Services | `#/services` | Offers with prices and the working process |
| Testimonials | `#/testimonials` | Client quotes |
| Blog | `#/blog` and `#/blog/1` | Post list, article pages and a newsletter box |
| Contact | `#/contact` | Contact form and links |
| Resume | `#/resume` | Printable resume (print or save as PDF) |
| Privacy, 404 | `#/privacy` and any unknown route | Sample privacy page and a friendly not-found page |

It also includes a dark mode toggle that remembers your choice and a mobile off-canvas menu.

## Structure

```
index.html   # page shell: header and footer
style.css    # all styles and the light and dark design tokens
script.js    # router, pages, demo data, filters, forms
```

## Customize

- **Your content:** edit the arrays at the top of `script.js` (`PROJECTS`, `SKILLS`, `JOBS`, `SERVICES`, `REVIEWS`, `POSTS`, `STACK`).
- **Colors:** change the CSS variables in `:root` and `[data-theme="dark"]` at the top of `style.css`.
- **Name and links:** replace "Alex Rivera", "alex.dev" and the social links in `index.html` and `script.js`.

The theme choice is kept in `localStorage`. The contact and newsletter forms are demos only, so connect them to your own service before going live.

## License

MIT
