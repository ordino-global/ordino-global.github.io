# ordino-global.github.io

GitHub Pages site for Ordino Global, with themed landing and interactive API documentation via [Scalar](https://scalar.com/products/api-references/integrations/html-js).

## Contents

- **Home** (`index.md`) — Landing page with a link to the API reference.
- **API Reference** (`/api.html`) — Full-page Scalar API docs loaded from your OpenAPI spec.

## Configuration

Edit `_config.yml` to point at your API spec:

- **`api_spec_url`** — URL of your OpenAPI/Swagger document (JSON or YAML). Default is Scalar’s Galaxy sample.
- **`proxy_url`** — Optional; set to `https://proxy.scalar.com` if you hit CORS when loading the spec.

Example for your own API:

```yaml
api_spec_url: "https://api.example.com/openapi.json"
proxy_url: "https://proxy.scalar.com"
```

## Theme

The site uses the [Cayman](https://github.com/pages-themes/cayman) Jekyll theme. To switch themes, change the `theme` value in `_config.yml` to another [supported theme](https://pages.github.com/themes/) (e.g. `jekyll-theme-minimal`, `jekyll-theme-slate`).