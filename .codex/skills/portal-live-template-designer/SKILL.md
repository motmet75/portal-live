---
name: portal-live-template-designer
description: Design, clone, repair, and deploy tenant-specific Thymeleaf storefronts in the portal-live repository. Use for live template HTML/CSS/JS work, tenant folder cloning, shared root fragments, cart and checkout integration, login-page integration, static asset routing, config.xml tenant mapping, or Git delivery for portal customer domains.
---

# Portal Live Template Designer

Maintain tenant storefronts in `/opt/portal-live` while preserving compatibility with the portal JAR and its Spring/Thymeleaf model.

## Start safely

1. Run `git -C /opt/portal-live status --short --branch` and `git -C /opt/portal-live pull --ff-only` before editing.
2. Preserve all unrelated staged, modified, and untracked files. Never include them in the task commit.
3. Read the tenant root fragment and relevant pages before designing:
   - `templates/<template>.html`: shared `head`, navigation, footer, and scripts.
   - `templates/<template>/`: page templates.
   - `static/<template>/`: CSS, JS, images, and other assets.
4. Read [references/portal-contract.md](references/portal-contract.md) before adding routes, cart, checkout, login, or tenant mappings.

## Implement a template change

- Put reusable navigation, footer, cart drawer, and asset imports in `templates/<template>.html`.
- Keep page-specific markup in `templates/<template>/<page>.html`.
- Use root-relative assets such as `/<template>/css/site.css`; never use filesystem paths in HTML.
- Prefer a small override stylesheet loaded after legacy theme styles. Avoid editing minified vendor files.
- Preserve Thymeleaf expressions and model property names already used by working templates.
- Make layouts responsive and verify light-image text contrast, mobile navigation, image/video sizing, and desktop hero height.
- Do not add backend routes when the existing JAR already supplies the required endpoint.

## Clone a tenant template

Clone database and template independently. Treat the full host, including subdomain, as `tenantId` (for example `cosmetic.anhmedia.vn`). A tenant may reuse a database with a new design or reuse a template with a new database.

Clone all three template surfaces when a complete design is needed:

```text
templates/<source>.html        -> templates/<target>.html
templates/<source>/            -> templates/<target>/
static/<source>/               -> static/<target>/
```

Replace asset prefixes and fragment names deliberately. Do not blindly replace customer-visible business names, database values, or third-party URLs.

## Validate and deliver

1. Run `node --check` for every changed custom JavaScript file.
2. Run `git -C /opt/portal-live diff --check`.
3. Inspect `git diff` and confirm static URLs match files under `static/`.
4. Stage only explicit task paths.
5. Commit only explicit paths when unrelated content is already staged:

```bash
git -C /opt/portal-live commit -m "Meaningful message" -- path/one path/two
```

6. Push `main`, then confirm the commit and status. On the server, deployment is normally:

```bash
cd /opt/portal-live
git pull --ff-only
```

Live-template changes do not normally require rebuilding or restarting the portal JAR.
