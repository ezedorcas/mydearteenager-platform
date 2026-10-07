import urllib.request
import re

url = 'https://commons.wikimedia.org/wiki/File:Canva_icon_2021.svg'
try:
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
    with urllib.request.urlopen(req) as resp:
        html = resp.read().decode('utf-8')
        m = re.findall(r'https://upload\.wikimedia\.org/wikipedia/commons/[^"\']+\.svg', html)
        print('Matches:', m)
        if m:
            svg_url = m[0]
            req2 = urllib.request.Request(svg_url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
            with urllib.request.urlopen(req2) as resp2:
                content = resp2.read().decode('utf-8')
                with open('scratch/canva_icon.svg', 'w', encoding='utf-8') as f:
                    f.write(content)
                print('Downloaded SVG!')
except Exception as e:
    print('Error:', e)

