from PIL import Image
import glob, os
for f in sorted(glob.glob(r'public/media/posters/*.jpg')):
    im=Image.open(f)
    print(os.path.basename(f), im.size, round(im.size[0]/im.size[1],3))
