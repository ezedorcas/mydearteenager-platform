import urllib.request
import json

req = urllib.request.Request('https://raw.githubusercontent.com/simple-icons/simple-icons/develop/_data/simple-icons.json', headers={'User-Agent': 'Mozilla/5.0'})
try:
    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read().decode('utf-8'))

    targets = ['canva', 'photoshop', 'capcut', 'openai', 'chatgpt', 'illustrator', 'visual studio code', 'vscode']
    for item in data:
        title = item['title'].lower()
        for t in targets:
            if t in title:
                slug = item.get('slug', item['title'].lower().replace(' ', ''))
                print(item['title'], '-> slug:', slug, '-> hex:', item.get('hex'))
except Exception as e:
    print('Error:', e)

