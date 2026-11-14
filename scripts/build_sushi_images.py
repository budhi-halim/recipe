#!/usr/bin/env python3
"""Generate five responsive WebP tiers for each sushi recipe from their approved themed photo sheet."""
from pathlib import Path
from PIL import Image
import json
ROOT=Path(__file__).resolve().parents[1]
source_dir=ROOT/'assets'/'sushi'
positions=json.loads((ROOT/'assets'/'sushi'/'positions.json').read_text('utf8'))
WIDTHS=(24,320,640,960,1440)
w=positions['width'];h=positions['height'];cols=positions['columns']
dest=ROOT/'assets'/'responsive';dest.mkdir(parents=True,exist_ok=True)
for i,slug in enumerate(positions['slugs']):
  assert slug.startswith('sushi-')
  row=i//cols;column=i%cols
  row_file=source_dir/f'row-{row}.jpg'
  assert row_file.exists(),f'Missing sushi source row: {row_file}'
  with Image.open(row_file) as image:
   image=image.convert('RGB')
   assert image.size==(cols*w,h),f'Row geometry does not match {image.size}'
   tile=image.crop((column*w,0,(column+1)*w,h))
  for target_width in WIDTHS:
   target=dest/f'{slug}-{target_width}.webp'
   height=round(tile.height*target_width/tile.width)
   rendered=tile if target_width==tile.width else tile.resize((target_width,height),Image.Resampling.LANCZOS)
   rendered.save(target,format='WEBP',quality=36 if target_width==24 else 80,method=6)
  print('Created/verified',slug)
