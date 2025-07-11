## `eta-hooked`

**Hookable file transformer for [Eta.js](https://eta.js.org)** — allows you to convert files like `.md`, `.mdx`, `.json` or anything else into HTML or plain text at the moment of template loading.

---

### What is this?

`eta-hooked` is a thin abstraction layer on top of Eta. It overrides the `readFile()` method and injects a `transformer()` hook that lets you process file content before it's rendered.

> It doesn't touch file resolution — just transforms the **already loaded content**.

---

### Installation

```bash
npm install eta-hooked
```

---

### Usage

```ts
import EtaHooked from "eta-hooked";
import { convertMarkdown } from "./markdown";

const eta = new EtaHooked({
  views: "./templates",
  transformer: (content, filename) => {
    if (filename.endsWith(".md")) {
      return convertMarkdown(content);
    }
    return content;
  },
});

const html = await eta.renderAsync("index.md", { title: "Policy" });
```

---

### Transformer Signature

```ts
((content:·string,·filename:·string)·=>·string);
```

- `content`: loaded file contents
- `filename`: normalized absolute path

Return transformed string or original content.

---

### Typical use cases

- Markdown → HTML conversion
- MDX or JSON preprocessing
- Injecting dynamic metadata
- Stripping or rewriting file content
- Parsing frontmatter manually

---

### Why use this?

- Abstract content layer for seamless transformation of diverse file formats before template compilation
- Keeps your `Eta` logic clean
- Supports any format and strategy you need

---

### License

MIT — adapt it to whatever your project needs.
