// make-images.mjs — generates the site's editorial artwork as SVG.
//
// Why generated rather than photographed: a stock photo of a product this site
// has not handled implies a relationship that does not exist, and hotlinking a
// manufacturer's render would breach the IP licence (A2). These are abstract
// illustrations of the *category*, drawn from the site's own palette. They
// cannot be mistaken for a photograph of a specific unit.

import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { PRODUCTS } from './data.mjs';

const ROOT = new URL('..', import.meta.url).pathname;
const DIR = join(ROOT, 'assets', 'img');
mkdirSync(DIR, { recursive: true });

const PAPER = '#f5f0e7';
const INK = '#1e4034';
const EMBER = '#b0501e';
const CREAM = '#fbf8f3';

const frame = (inner, w = 640, h = 360, bg = PAPER) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#fdfbf7"/><stop offset="1" stop-color="${bg}"/>
    </linearGradient>
    <pattern id="dots" width="18" height="18" patternUnits="userSpaceOnUse">
      <circle cx="2" cy="2" r="1" fill="${INK}" opacity=".07"/>
    </pattern>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#g)"/>
  <rect width="${w}" height="${h}" fill="url(#dots)"/>
  ${inner}
</svg>
`;

// A dual-basket drawer unit, drawn in elevation.
const dualBasket = (c = INK) => `
  <g transform="translate(320 190)">
    <rect x="-150" y="-96" width="300" height="34" rx="6" fill="${c}" opacity=".9"/>
    <rect x="-136" y="-62" width="272" height="128" rx="10" fill="none" stroke="${c}" stroke-width="3.5"/>
    <line x1="0" y1="-62" x2="0" y2="66" stroke="${c}" stroke-width="3.5"/>
    <rect x="-122" y="-46" width="112" height="96" rx="6" fill="${c}" opacity=".1" stroke="${c}" stroke-width="2"/>
    <rect x="10" y="-46" width="112" height="96" rx="6" fill="${c}" opacity=".1" stroke="${c}" stroke-width="2"/>
    <rect x="-40" y="-24" width="80" height="44" rx="4" fill="${c}" opacity=".16"/>
    <rect x="-60" y="-14" width="120" height="6" rx="3" fill="${c}" opacity=".55"/>
    <circle cx="-96" cy="-104" r="3" fill="${EMBER}"/>
    <circle cx="-84" cy="-104" r="3" fill="${c}" opacity=".35"/>
    <path d="M-118 66 L-118 84 L118 84 L118 66" fill="none" stroke="${c}" stroke-width="3"/>
  </g>`;

const singleBasket = (c = INK) => `
  <g transform="translate(320 190)">
    <rect x="-108" y="-110" width="216" height="40" rx="8" fill="${c}" opacity=".9"/>
    <path d="M-118 -70 L118 -70 L104 78 L-104 78 Z" fill="none" stroke="${c}" stroke-width="3.5"/>
    <path d="M-102 -30 L102 -30" stroke="${c}" stroke-width="2" opacity=".4"/>
    <rect x="-70" y="-90" width="140" height="16" rx="5" fill="${CREAM}" opacity=".9"/>
    <circle cx="52" cy="-82" r="4" fill="${EMBER}"/>
    <path d="M-30 -14 q30 -26 60 0" fill="none" stroke="${c}" stroke-width="2.5" opacity=".5"/>
    <path d="M-40 22 q40 -30 80 0" fill="none" stroke="${c}" stroke-width="2.5" opacity=".35"/>
    <path d="M-24 84 L24 84" stroke="${c}" stroke-width="4" stroke-linecap="round"/>
  </g>`;

const oven = (c = INK) => `
  <g transform="translate(320 186)">
    <rect x="-158" y="-104" width="316" height="196" rx="10" fill="none" stroke="${c}" stroke-width="3.5"/>
    <rect x="-146" y="-92" width="292" height="96" rx="4" fill="${c}" opacity=".08"/>
    <line x1="-2" y1="-92" x2="-2" y2="4" stroke="${c}" stroke-width="3"/>
    <circle cx="-120" cy="40" r="7" fill="none" stroke="${c}" stroke-width="2.5"/>
    <circle cx="-92" cy="40" r="7" fill="none" stroke="${c}" stroke-width="2.5"/>
    <rect x="-60" y="30" width="150" height="18" rx="9" fill="${c}" opacity=".12"/>
    <circle cx="128" cy="39" r="4" fill="${EMBER}"/>
    <rect x="-140" y="52" width="280" height="4" rx="2" fill="${c}" opacity=".25"/>
    <path d="M-158 92 L-158 106 L158 106 L158 92" fill="none" stroke="${c}" stroke-width="3"/>
    <path d="M-160 -104 q160 -26 320 0" fill="none" stroke="${c}" stroke-width="2" opacity=".25"/>
  </g>`;

const instantRead = (c = INK) => `
  <g transform="translate(320 186) rotate(-14)">
    <rect x="-128" y="-30" width="150" height="60" rx="14" fill="none" stroke="${c}" stroke-width="3.5"/>
    <rect x="-112" y="-16" width="70" height="34" rx="6" fill="${c}" opacity=".12"/>
    <text x="-77" y="8" font-family="Georgia, serif" font-size="22" fill="${c}" text-anchor="middle">165</text>
    <circle cx="-24" cy="0" r="6" fill="${EMBER}"/>
    <path d="M22 -8 L126 -8 L126 8 L22 8" fill="none" stroke="${c}" stroke-width="3.5"/>
    <path d="M22 0 L126 0" stroke="${c}" stroke-width="6" stroke-linecap="round"/>
    <path d="M126 -8 L150 0 L126 8" fill="${c}"/>
    <line x1="-128" y1="-6" x2="-150" y2="-6" stroke="${c}" stroke-width="2" opacity=".3"/>
    <line x1="-128" y1="6" x2="-150" y2="6" stroke="${c}" stroke-width="2" opacity=".3"/>
  </g>`;

const wirelessProbe = (c = INK) => `
  <g transform="translate(320 186)">
    <rect x="-124" y="-84" width="128" height="168" rx="16" fill="none" stroke="${c}" stroke-width="3.5"/>
    <rect x="-108" y="-66" width="96" height="70" rx="8" fill="${c}" opacity=".12"/>
    <text x="-60" y="-18" font-family="Georgia, serif" font-size="30" fill="${c}" text-anchor="middle">141</text>
    <circle cx="-60" cy="46" r="17" fill="none" stroke="${EMBER}" stroke-width="3"/>
    <circle cx="-60" cy="46" r="4" fill="${EMBER}"/>
    <g opacity=".85">
      <path d="M34 -40 q26 22 0 44" fill="none" stroke="${c}" stroke-width="3"/>
      <path d="M52 -58 q42 40 0 80" fill="none" stroke="${c}" stroke-width="3" opacity=".7"/>
      <path d="M70 -76 q58 58 0 116" fill="none" stroke="${c}" stroke-width="3" opacity=".45"/>
    </g>
    <g transform="translate(96 92) rotate(38)">
      <path d="M0 30 L0 -34" stroke="${c}" stroke-width="5" stroke-linecap="round"/>
      <path d="M0 -34 L0 -78" stroke="${EMBER}" stroke-width="3" stroke-linecap="round"/>
      <rect x="-9" y="26" width="18" height="26" rx="4" fill="${c}" opacity=".2"/>
    </g>
  </g>`;

const ART = {
  'chefman-6qt-dual-basket': dualBasket,
  'chefman-8qt-turbofry': singleBasket,
  'emeril-26qt-french-door': oven,
  'thermomaven-1s-thermometer': instantRead,
  'chef-iq-sense-gen3': wirelessProbe,
};

let n = 0;
for (const p of PRODUCTS) {
  const draw = ART[p.slug];
  if (!draw) throw new Error(`no artwork for ${p.slug}`);
  writeFileSync(join(DIR, `${p.slug}.svg`), frame(draw()), 'utf8');
  n++;
}

// Category headers
writeFileSync(
  join(DIR, 'air-fryers.svg'),
  frame(`${dualBasket('#1e4034')}`, 640, 300),
  'utf8'
);
writeFileSync(
  join(DIR, 'thermometers.svg'),
  frame(`${instantRead('#1e4034')}`, 640, 300),
  'utf8'
);

// Default OG card: type only.
writeFileSync(
  join(DIR, 'og-default.svg'),
  frame(
    `<g>
      <rect x="0" y="0" width="640" height="8" fill="${EMBER}"/>
      <text x="48" y="150" font-family="Georgia, serif" font-size="52" font-weight="600" fill="${INK}">counterwise.</text>
      <text x="48" y="196" font-family="Helvetica, Arial, sans-serif" font-size="19" fill="#6b6459">Kitchen gear, chosen by question rather than by hype.</text>
      <line x1="48" y1="228" x2="592" y2="228" stroke="#d3c9b8" stroke-width="1.5"/>
      <text x="48" y="262" font-family="Helvetica, Arial, sans-serif" font-size="14" fill="#948b7d">3 air fryers · 2 thermometers · every unverified claim labelled</text>
      <text x="48" y="292" font-family="Helvetica, Arial, sans-serif" font-size="12" fill="#b0501e">As an Amazon Associate I earn from qualifying purchases.</text>
    </g>`,
    640,
    320,
    '#f5f0e7'
  ),
  'utf8'
);

console.log(`wrote ${n} product illustrations + 3 shared images`);
