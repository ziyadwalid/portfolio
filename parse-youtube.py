import json, re, html, os
raw = open('.tmp/youtube-page.html', encoding='utf-8', errors='replace').read()
out = {}
m = re.search(r'<title>(.*?)</title>', raw, re.S)
if m: out['title'] = html.unescape(m.group(1))
marker = 'ytInitialPlayerResponse = '
idx = raw.find(marker)
if idx >= 0:
    obj, _ = json.JSONDecoder().raw_decode(raw[idx+len(marker):])
    vd = obj.get('videoDetails', {})
    captions = obj.get('captions', {}).get('playerCaptionsTracklistRenderer', {}).get('captionTracks', [])
    out.update({
        'videoTitle': vd.get('title'),
        'author': vd.get('author'),
        'channelId': vd.get('channelId'),
        'lengthSeconds': vd.get('lengthSeconds'),
        'viewCount': vd.get('viewCount'),
        'publishDate': vd.get('publishDate'),
        'description': vd.get('shortDescription'),
        'keywords': vd.get('keywords'),
        'thumbnail': vd.get('thumbnail', {}).get('thumbnails', [])[-1] if vd.get('thumbnail') else None,
        'captions': [{'lang': c.get('languageCode'), 'name': c.get('name', {}).get('simpleText') or c.get('name', {}).get('runs',[{}])[0].get('text'), 'url': c.get('baseUrl')} for c in captions],
        'playability': obj.get('playabilityStatus', {}).get('status'),
        'playabilityReason': obj.get('playabilityStatus', {}).get('reason'),
    })
with open('.tmp/youtube-meta.json','w',encoding='utf-8') as f: json.dump(out,f,ensure_ascii=False,indent=2)
print(json.dumps(out, ensure_ascii=False, indent=2)[:9000])
