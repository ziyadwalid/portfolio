import pymupdf, os, json
base = r'public/cv'
out = r'.tmp/pdf-review'
report = {}
for name in ['ziad-vd-cv-en.pdf','ziad-vd-cv-ar.pdf']:
    doc = pymupdf.open(os.path.join(base,name))
    pages=[]
    for i,page in enumerate(doc):
        pix=page.get_pixmap(dpi=150)
        img=os.path.join(out, f'{name[:-4]}-p{i+1}.png')
        pix.save(img)
        blocks=[b for b in page.get_text('blocks')]
        max_y=max((b[3] for b in blocks), default=0)
        text=page.get_text()
        txt_path=os.path.join(out, f'{name[:-4]}.txt')
        with open(txt_path,'w',encoding='utf-8') as f: f.write(text)
        pages.append({
          'page':i+1,
          'size':[round(page.rect.width,1),round(page.rect.height,1)],
          'maxTextY':round(max_y,1),
          'bottomMargin':round(page.rect.height-max_y,1),
          'image':img,
          'imageSize':[pix.width,pix.height],
          'email': 'zeadwalid56@gmail.com' in text,
          'placeholder': 'Proficiency details pending' in text or '?????? ????? ???????' in text,
          'links':[l.get('uri') for l in page.get_links()],
        })
    report[name]={'pages':pages,'textFile':os.path.join(out,f'{name[:-4]}.txt')}
    doc.close()
print(json.dumps(report,ensure_ascii=False,indent=2))
