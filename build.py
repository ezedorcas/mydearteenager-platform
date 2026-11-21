#!/usr/bin/env python3
"""Builds the MyDearTeenager website.

src/pages/*.html   page bodies. Line 1 is a JSON comment: {"title", "desc", "nav", "scripts"}
src/partials/*.html shared pieces, included with {{> name}}
static/            copied as-is (css, js, images)

Output: dist/ (upload this folder to any static host)
Also writes dist-artifact/ with index.html as a fragment for the Claude artifact preview.
"""
import json, re, shutil, pathlib

ROOT = pathlib.Path(__file__).parent
SRC, STATIC = ROOT / "src", ROOT / "static"
DIST, ART = ROOT / "dist", ROOT / "dist-artifact"

partials = {p.stem: p.read_text() for p in (SRC / "partials").glob("*.html")}

def include(text):
    for _ in range(3):
        text = re.sub(r"\{\{>\s*([\w-]+)\s*\}\}", lambda m: partials[m.group(1)], text)
    return text

NAV = [("how-it-works", "How it works"), ("academy", "Skill Academy"), ("parents", "Parents"),
       ("schools", "Schools"), ("teach", "Teach"), ("about", "About")]

def nav_html(active):
    return "\n".join(
        f'<a href="{slug}.html"{" aria-current=\"page\"" if slug == active else ""}>{label}</a>' for slug, label in NAV)

MENU_NOTES = {"how-it-works": "the loop", "academy": "courses", "parents": "for you", "schools": "partners",
              "teach": "tutors", "about": "our story", "opportunities": "go further", "faq": "questions", "contact": "say hi"}
MENU = [("index", "Home")] + NAV + [("opportunities", "Opportunities"), ("faq", "FAQ"), ("contact", "Contact")]

def menu_html(active):
    out = []
    for i, (slug, label) in enumerate(MENU):
        cur = ' aria-current="page"' if slug == active else ""
        note = MENU_NOTES.get(slug)
        out.append(f'<li style="--i:{i}"><a href="{slug}.html"{cur}>{label}{f" <small>{note}</small>" if note else ""}</a></li>')
    return "\n".join(out)

pages = sorted((SRC / "pages").glob("*.html"))
bodies, metas = {}, {}
for p in pages:
    raw = p.read_text()
    first, rest = raw.split("\n", 1)
    meta = json.loads(first.strip()[4:-3])
    bodies[p.stem] = include(rest)
    metas[p.stem] = meta

# Material Symbols: collect every icon name used anywhere so the font request stays small
icons = set()
for text in list(bodies.values()) + list(partials.values()):
    icons |= set(re.findall(r'class="ms[^"]*"[^>]*>([a-z0-9_]+)<', text))
js_text = (STATIC / "assets/js/site.js").read_text() + (STATIC / "assets/js/courses.js").read_text()
icons |= set(re.findall(r'class="ms[^"]*"[^>]*>([a-z0-9_]+)<', js_text))
icons |= set(re.findall(r'icon:\s*"([a-z0-9_]+)"', js_text))
icons |= {"menu", "close"}
ICONS = ",".join(sorted(icons))

def head(meta, slug):
    title = "MyDearTeenager" if slug == "index" else f'{meta["title"]} | MyDearTeenager'
    return include(partials["head"]).replace("{{title}}", title).replace("{{desc}}", meta["desc"]).replace("{{icons}}", ICONS)

def body(meta, slug):
    scripts = "".join(f'<script src="assets/js/{s}" defer></script>\n' for s in meta.get("scripts", []))
    hdr = partials["header"].replace("{{nav}}", nav_html(meta.get("nav", slug)))
    menu = partials["menu"].replace("{{menu}}", menu_html(meta.get("nav", slug)))
    return (f'<a class="skip" href="#main">Skip to content</a>\n{hdr}\n<main id="main">\n{bodies[slug]}\n</main>\n'
            f'{include(partials["footer"])}\n{menu}\n{scripts}<script src="assets/js/site.js" defer></script>\n')

for d in (DIST, ART):
    if d.exists(): shutil.rmtree(d)
    shutil.copytree(STATIC, d)

for slug, meta in metas.items():
    doc = (f'<!doctype html>\n<html lang="en-NG">\n<head>\n{head(meta, slug)}\n</head>\n<body>\n{body(meta, slug)}</body>\n</html>\n')
    (DIST / f"{slug}.html").write_text(doc)
    if slug == "index":
        # artifact main page: the host adds doctype/head itself, so ship a fragment
        h = re.sub(r'<meta charset[^>]*>\s*|<meta name="viewport"[^>]*>\s*', "", head(meta, slug))
        (ART / "index.html").write_text(h + "\n" + body(meta, slug))
    else:
        (ART / f"{slug}.html").write_text(doc)

print(f"built {len(metas)} pages, {len(icons)} icons")
