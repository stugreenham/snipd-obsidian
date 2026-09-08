# Snipd (personal fork) 🎙️

Personal fork of the [official Snipd Obsidian plugin](https://github.com/snipd-app/snipd-obsidian) by Stu Greenham.

## Changes from upstream

- **Removed base view** — no `.base` files or Obsidian Bases integration synced to the vault
- **Removed additional properties** — custom YAML frontmatter properties are now defined directly in the episode template
- **Ribbon icon** now triggers a sync instead of opening the base view
- Plugin ID changed to `snipd-fork` so it can coexist with the official plugin

## Manual installation

1. Download `main.js`, `manifest.json`, and `styles.css` from the [latest release](https://github.com/stugreenham/snipd-obsidian/releases/latest)
2. Create a folder at `.obsidian/plugins/snipd-fork/` inside your vault
3. Copy the three files into that folder
4. Enable the plugin in Obsidian → Settings → Community plugins

## Keeping up with upstream

```bash
git fetch upstream
git merge upstream/master
```

Resolve any conflicts, bump the version suffix (`fork.2`, `fork.3`, …), and push a new tag to release.

---

*Based on [snipd-app/snipd-obsidian](https://github.com/snipd-app/snipd-obsidian) — all core sync logic and the Snipd API integration are unchanged.*
