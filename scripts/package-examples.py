from pathlib import Path
import hashlib,json,zipfile
root=Path(__file__).resolve().parents[1]; assets=root/'public/examples'; manifest={'sourceFiles':{},'archives':{}}
for name in ['flowstride-storage-example']:
 folder=assets/name; archive=assets/(name+'.zip')
 with zipfile.ZipFile(archive,'w',zipfile.ZIP_DEFLATED) as z:
  for p in sorted(folder.rglob('*')):
   if p.is_file():
    z.write(p,str(p.relative_to(assets)));manifest['sourceFiles'][str(p.relative_to(assets))]=hashlib.sha256(p.read_bytes()).hexdigest()
 manifest['archives'][archive.name]=hashlib.sha256(archive.read_bytes()).hexdigest()
manual=assets/'manual-checkout.json';manifest['sourceFiles'][manual.name]=hashlib.sha256(manual.read_bytes()).hexdigest()
(assets/'examples-manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
print('Packaged the storage example and recorded source/archive hashes')
