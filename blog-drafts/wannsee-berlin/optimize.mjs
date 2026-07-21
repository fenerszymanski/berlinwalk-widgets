import { execFileSync } from 'node:child_process';
const MAP = {
  '1b-strandkoerbe': 'cover-strandbad-wannsee',
  '6b-sails': 'wannsee-sailboats',
  '4a-liebermann-garden': 'liebermann-garden',
  '5a-ghwk-garden': 'wannsee-conference-house',
  '2b-castle-havel': 'pfaueninsel-castle',
  '3a-peacock-display': 'pfaueninsel-peacock',
  '7a-f10-pier': 'f10-ferry-wannsee',
};
for (const [raw, out] of Object.entries(MAP)) {
  const py = `
from PIL import Image
im = Image.open('images/raw/${raw}-full.jpg').convert('RGB')
im.thumbnail((1600,1600), Image.LANCZOS)
im.save('images/optimized/${out}.jpg', 'JPEG', quality=86, optimize=True, progressive=True)
print('${out}', im.size)
`;
  execFileSync('python3', ['-c', py], { stdio: 'inherit' });
}
