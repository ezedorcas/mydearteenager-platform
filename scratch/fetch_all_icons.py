import urllib.request
import json

def get_svg(url):
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
    with urllib.request.urlopen(req) as resp:
        return resp.read().decode('utf-8')

sources = {
    'canva': 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/canva.svg',
    'adobephotoshop': 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/adobephotoshop.svg',
    'openai': 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/openai.svg',
    'adobeillustrator': 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/adobeillustrator.svg',
    'visualstudiocode': 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/visualstudiocode.svg',
    'figma': 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/figma.svg',
    'notion': 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/notion.svg',
    'framer': 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/framer.svg',
    'meta': 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/meta.svg',
    'capcut': 'https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/capcut-icon.svg',
}

out = {}
for name, url in sources.items():
    try:
        svg = get_svg(url)
        out[name] = svg
    except Exception as e:
        out[name] = f'ERROR: {e}'

with open('scratch/fetched_icons.json', 'w', encoding='utf-8') as f:
    json.dump(out, f, indent=2)
print("SUCCESS: wrote scratch/fetched_icons.json")

