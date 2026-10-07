import json

with open('scratch/fetched_icons.json', 'r', encoding='utf-8') as f:
    icons = json.load(f)

html = f"""<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
body {{ font-family: sans-serif; background: #f1f5f9; padding: 40px; display: grid; grid-template-columns: repeat(5, 1fr); gap: 20px; }}
.card {{ background: white; padding: 20px; border-radius: 12px; display: flex; align-items: center; gap: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); }}
.icon-box {{ width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; }}
.icon-box svg {{ width: 28px; height: 28px; }}
</style>
</head>
<body>
"""

for name, svg in icons.items():
    html += f"""
<div class="card">
  <div class="icon-box">{svg}</div>
  <div><strong>{name}</strong></div>
</div>
"""

html += """
</body>
</html>
"""

with open('scratch/test_icons.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("Saved test_icons.html")

