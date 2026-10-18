import fitz, os
base = r'public/cv'
out = r'.tmp/pdf-review'
for name in ['ziad-vd-cv-en.pdf','ziad-vd-cv-ar.pdf']:
    path = os.path.join(base,name)
    doc = fitz.open(path)
    print('===',name,'pages=',doc.page_count,'===')
    for i,page in enumerate(doc):
        pix = page.get_pixmap(dpi=150)
        p = os.path.join(out, f'{name[:-4]}-p{i+1}.png')
        pix.save(p)
        print('page',i+1,'size',page.rect.width,page.rect.height,'image',pix.width,pix.height,'imagebytes',os.path.getsize(p))
        print(page.get_text()[:1400].replace('\n',' | '))
        print('links', [(l.get('uri')) for l in page.get_links()])
    doc.close()
