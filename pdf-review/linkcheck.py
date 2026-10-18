import pymupdf, json, os
out={}
for name in ['ziad-vd-cv-en.pdf','ziad-vd-cv-ar.pdf']:
    doc=pymupdf.open(os.path.join('public/cv',name))
    out[name]={'pages':doc.page_count,'links':[l.get('uri') for p in doc for l in p.get_links()],'size':os.path.getsize(os.path.join('public/cv',name))}
    doc.close()
print(json.dumps(out,indent=2))
