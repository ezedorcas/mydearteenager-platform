"""Builds index.html for the MDT app prototype.

Collects every Material Symbols icon name used in the scripts so the icon font request stays small,
then writes:
  index.html            full document (open locally or host anywhere)
  dist-artifact/        same files, with index.html as a fragment for the artifact host
"""
import re, shutil, pathlib

ROOT = pathlib.Path(__file__).parent
ART = ROOT / "dist-artifact"
JS = ["data.js", "catalog.js", "player.js", "course.js", "app.js"]

js_text = "".join((ROOT / "assets/js" / f).read_text() for f in JS)
icons = set()
icons |= set(re.findall(r'\bic\(\s*"([a-z0-9_]+)"', js_text))
icons |= set(re.findall(r'class="ms[^"]*"[^>]*>([a-z0-9_]+)<', js_text))
icons |= set(re.findall(r'\b(?:icon|i):\s*"([a-z0-9_]+)"', js_text))
# nav arrays: ["home", "Home", "home"] -> third item is the icon
icons |= {m[2] for m in re.findall(r'\[\s*"([a-z]+)",\s*"([A-Z][^"]*)",\s*"([a-z0-9_]+)"\s*\]', js_text)}
extra = (ROOT / "icons-extra.txt")
if extra.exists():
    icons |= {l.strip() for l in extra.read_text().split() if l.strip()}
ICONS = ",".join(sorted(icons))

HEAD = f"""<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>MDT App Prototype</title>
<meta name="description" content="Clickable prototype of the MyDearTeenager learning app: learner, parent, tutor and school dashboards, plus the Design Basics pilot course.">
<meta name="theme-color" content="#201D4B">
<link rel="icon" type="image/png" href="assets/img/logo.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400..800&family=Caveat:wght@500..700&display=swap">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,500,0..1,0&icon_names={ICONS}&display=block">
<link rel="stylesheet" href="assets/css/site.css">
<link rel="stylesheet" href="assets/css/app.css">"""

BODY = '<div id="app"></div>\n' + "".join(f'<script src="assets/js/{f}"></script>\n' for f in JS)
BODY_SCRIPT = '<script>document.body.classList.add("app")</script>\n'

doc = f'<!doctype html>\n<html lang="en-NG">\n<head>\n{HEAD}\n</head>\n<body class="app">\n{BODY}</body>\n</html>\n'
(ROOT / "index.html").write_text(doc)

if ART.exists():
    shutil.rmtree(ART)
ART.mkdir()
shutil.copytree(ROOT / "assets", ART / "assets")
frag_head = re.sub(r'<meta charset[^>]*>\s*|<meta name="viewport"[^>]*>\s*', "", HEAD)
(ART / "index.html").write_text(frag_head + "\n" + BODY_SCRIPT + BODY)
print(f"built, {len(icons)} icons: {ICONS}")
