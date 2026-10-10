// Procedural architectural illustration generator matching reference prototype
function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const SKY = [
  ['#BFE3F2', '#F4F7E8'],
  ['#FCD9B6', '#FDEFD9'],
  ['#CFE4DA', '#F1F5EC'],
  ['#C9D6F2', '#EEF1FA'],
  ['#F6D2C8', '#FBEDE4'],
  ['#D4E8C2', '#F5F8E8'],
];

const WALL = [
  ['#E9E2D3', '#B9AE98'],
  ['#DDE7E2', '#9FB5AB'],
  ['#EBD9CC', '#C2A28E'],
  ['#E2E6EE', '#A5AEC4'],
  ['#EDE6C9', '#C4B77F'],
];

const ARTC: Record<string, string> = {};

export function getArt(seed: number, kind: string = 'ext'): string {
  const key = `${seed}_${kind}`;
  if (ARTC[key]) return ARTC[key];

  const w = 800;
  const h = 600;
  const r = rng(seed * 7919 + kind.charCodeAt(0) * 131 + kind.length);
  const sky = SKY[Math.floor(r() * SKY.length)];
  const wall = WALL[Math.floor(r() * WALL.length)];

  let s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}"><defs><linearGradient id="g_${seed}_${kind}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${sky[0]}"/><stop offset="1" stop-color="${sky[1]}"/></linearGradient></defs>`;

  if (kind === 'ext') {
    s += `<rect width="${w}" height="${h}" fill="url(#g_${seed}_${kind})"/><circle cx="${110 + r() * 200}" cy="${90 + r() * 40}" r="${34 + r() * 14}" fill="#fff" opacity=".75"/>`;
    for (let i = 0; i < 7; i++) {
      const bw = 70 + r() * 70;
      const bx = i * 120 - 30 + r() * 30;
      const bh = 130 + r() * 190;
      s += `<rect x="${bx}" y="${h - 90 - bh}" width="${bw}" height="${bh}" fill="${wall[1]}" opacity=".32"/>`;
    }
    const cols = 3 + Math.floor(r() * 2);
    const rows = 4 + Math.floor(r() * 2);
    const bw = 440 + r() * 60;
    const bx = (w - bw) / 2 + (r() - 0.5) * 70;
    const bh = rows * 68 + 46;
    const by = h - 90 - bh;
    s += `<rect x="${bx}" y="${by}" width="${bw}" height="${bh}" fill="${wall[0]}"/><rect x="${bx - 6}" y="${by - 8}" width="${bw + 12}" height="16" fill="${wall[1]}"/>`;
    const cw = (bw - 60) / cols;
    for (let rr = 0; rr < rows; rr++) {
      s += `<rect x="${bx}" y="${by + 30 + rr * 68 + 50}" width="${bw}" height="5" fill="${wall[1]}" opacity=".6"/>`;
      for (let c = 0; c < cols; c++) {
        const lit = r() > 0.7;
        s += `<rect x="${bx + 30 + c * cw + cw * 0.14}" y="${by + 30 + rr * 68}" width="${cw * 0.72}" height="46" rx="3" fill="${lit ? '#F7DE8B' : '#8DB4C8'}"/><rect x="${bx + 30 + c * cw + cw * 0.5 - 1}" y="${by + 30 + rr * 68}" width="2" height="46" fill="${wall[0]}"/>`;
      }
    }
    s += `<rect x="${bx + bw / 2 - 30}" y="${h - 90 - 62}" width="60" height="62" rx="4" fill="${wall[1]}"/><rect x="0" y="${h - 90}" width="${w}" height="90" fill="#7FA88F"/><rect x="0" y="${h - 60}" width="${w}" height="60" fill="#A9B3AE" opacity=".55"/>`;
    for (let i = 0; i < 4; i++) {
      const tx = r() * w;
      s += `<rect x="${tx - 4}" y="${h - 150}" width="8" height="64" fill="#6B5A47"/><circle cx="${tx}" cy="${h - 165}" r="${30 + r() * 14}" fill="#4F8F6B" opacity=".92"/>`;
    }
  } else {
    s += `<rect width="${w}" height="${h}" fill="${wall[0]}"/><rect y="${h * 0.72}" width="${w}" height="${h * 0.28}" fill="${wall[1]}" opacity=".55"/><rect y="${h * 0.72 - 6}" width="${w}" height="8" fill="${wall[1]}" opacity=".5"/>`;
    const wx = 90 + r() * 380;
    if (kind !== 'bath') {
      s += `<rect x="${wx}" y="70" width="190" height="230" rx="6" fill="url(#g_${seed}_${kind})" stroke="#fff" stroke-width="10"/><rect x="${wx + 93}" y="70" width="5" height="230" fill="#fff"/><rect x="${wx}" y="180" width="190" height="5" fill="#fff"/>`;
    }
    if (kind === 'living') {
      s += `<ellipse cx="400" cy="520" rx="260" ry="46" fill="${sky[0]}" opacity=".7"/><rect x="80" y="330" width="330" height="130" rx="22" fill="#4F7F6B"/><rect x="80" y="290" width="330" height="70" rx="20" fill="#5C8F79"/><rect x="60" y="340" width="40" height="110" rx="16" fill="#44705E"/><rect x="390" y="340" width="40" height="110" rx="16" fill="#44705E"/><rect x="520" y="400" width="190" height="14" rx="4" fill="#8C6B4A"/><rect x="545" y="414" width="12" height="60" fill="#8C6B4A"/><rect x="672" y="414" width="12" height="60" fill="#8C6B4A"/><rect x="${wx > 350 ? 100 : 640}" y="240" width="10" height="${r() > 0.5 ? 180 : 150}" fill="#555"/><circle cx="${wx > 350 ? 105 : 645}" cy="230" r="34" fill="#F7E3A1"/>`;
    } else if (kind === 'bed') {
      s += `<rect x="120" y="270" width="460" height="40" rx="8" fill="#7B5E48"/><rect x="100" y="320" width="500" height="150" rx="14" fill="#F2EFE8"/><rect x="100" y="400" width="500" height="80" rx="12" fill="${sky[0]}"/><rect x="140" y="326" width="140" height="56" rx="18" fill="#fff"/><rect x="420" y="326" width="140" height="56" rx="18" fill="#fff"/><rect x="640" y="150" width="120" height="330" rx="6" fill="#B79C80"/><rect x="700" y="290" width="6" height="40" fill="#6b5543"/>`;
    } else if (kind === 'kitchen') {
      s += `<rect x="0" y="40" width="${w}" height="130" fill="${wall[1]}" opacity=".18"/><rect x="40" y="60" width="300" height="110" rx="6" fill="#F4F1EA" stroke="${wall[1]}"/><rect x="460" y="60" width="300" height="110" rx="6" fill="#F4F1EA" stroke="${wall[1]}"/><rect x="0" y="360" width="${w}" height="26" fill="#DAD5C8"/><rect x="0" y="386" width="${w}" height="214" fill="#F1EEE6"/><rect x="40" y="396" width="150" height="190" rx="4" fill="#E7E2D5" stroke="${wall[1]}"/><rect x="210" y="396" width="150" height="190" rx="4" fill="#E7E2D5" stroke="${wall[1]}"/><rect x="520" y="300" width="170" height="60" rx="6" fill="#444"/><circle cx="560" cy="330" r="14" fill="#777"/><circle cx="640" cy="330" r="14" fill="#777"/>`;
    } else {
      for (let x = 0; x < w; x += 80) {
        for (let y = 0; y < h * 0.72; y += 80) {
          s += `<rect x="${x + 3}" y="${y + 3}" width="74" height="74" rx="4" fill="#fff" opacity=".55"/>`;
        }
      }
      s += `<rect x="120" y="360" width="400" height="130" rx="40" fill="#fff" stroke="${wall[1]}" stroke-width="6"/><rect x="560" y="200" width="130" height="190" rx="8" fill="${sky[0]}" stroke="#fff" stroke-width="8"/><circle cx="640" cy="440" r="40" fill="#fff" stroke="${wall[1]}" stroke-width="6"/>`;
    }
  }

  s += '</svg>';
  return (ARTC[key] = 'data:image/svg+xml;utf8,' + encodeURIComponent(s));
}
