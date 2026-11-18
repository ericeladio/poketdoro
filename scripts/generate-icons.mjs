import { mkdir, writeFile } from 'node:fs/promises'
import sharp from 'sharp'

const art = `
  <g shape-rendering="crispEdges">
    <path d="M17 23 L24 9 L29 25 Z" fill="#F5E7C6" stroke="#173326" stroke-width="1.8" stroke-linejoin="round"/>
    <path d="M47 23 L40 9 L35 25 Z" fill="#F5E7C6" stroke="#173326" stroke-width="1.8" stroke-linejoin="round"/>
    <ellipse cx="32" cy="35" rx="17.5" ry="15.5" fill="#173326"/>
    <ellipse cx="32" cy="33.5" rx="15" ry="13" fill="#54C96F"/>
    <rect x="25" y="23" width="3" height="2" fill="#8BE39A"/>
    <rect x="35" y="24" width="3" height="2" fill="#8BE39A"/>
    <rect x="30" y="26" width="2" height="2" fill="#8BE39A"/>
    <ellipse cx="23" cy="32" rx="5.6" ry="6.2" fill="#173326"/>
    <ellipse cx="41" cy="32" rx="5.6" ry="6.2" fill="#173326"/>
    <ellipse cx="23" cy="32" rx="4" ry="4.6" fill="#3C6FE0"/>
    <ellipse cx="41" cy="32" rx="4" ry="4.6" fill="#3C6FE0"/>
    <rect x="20" y="28" width="2.2" height="2.2" fill="#FFFFFF"/>
    <rect x="38" y="28" width="2.2" height="2.2" fill="#FFFFFF"/>
    <rect x="25" y="34.5" width="2" height="2" fill="#2A55B8"/>
    <rect x="43" y="34.5" width="2" height="2" fill="#2A55B8"/>
    <ellipse cx="32" cy="43" rx="8.5" ry="5.2" fill="#F5E7C6"/>
    <rect x="28.8" y="41" width="1.6" height="1.6" fill="#173326"/>
    <rect x="33.6" y="41" width="1.6" height="1.6" fill="#173326"/>
    <path d="M28 45 q4 3 8 0" stroke="#173326" stroke-width="1.7" fill="none" stroke-linecap="square"/>
    <rect x="15" y="39" width="3.2" height="2" fill="#F58FA3"/>
    <rect x="45.8" y="39" width="3.2" height="2" fill="#F58FA3"/>
    <path d="M50 22 q-5 -5 -3 -10 q1.5 -4.5 5 -6.5 q1 4 3 5.5 q3.5 3 2 7.5 q3 -1 3.5 2.5 q0.5 5 -5 5.5 q-5.5 0.5 -5.5 -4.5z" fill="#FFC94D" stroke="#173326" stroke-width="1.6" stroke-linejoin="round"/>
    <path d="M52.5 20 q-2.5 -4 -0.5 -7 q2 3.5 3 4.5 q2 2.5 0 4.5 q-2.5 1 -2.5 -2z" fill="#F5A33C"/>
  </g>
`

const rounded = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="512" height="512">
  <rect width="64" height="64" rx="14" fill="#1F4D3A"/>
  <rect x="3" y="3" width="58" height="58" rx="11" fill="none" stroke="#173326" stroke-width="2"/>
  <rect x="6" y="52" width="52" height="6" rx="3" fill="#2E8B4F"/>
  ${art}
</svg>`

const maskable = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="512" height="512">
  <rect width="64" height="64" fill="#1F4D3A"/>
  <rect x="4" y="50" width="56" height="14" fill="#2E8B4F"/>
  <rect x="4" y="46" width="56" height="4" fill="#3C9E5C"/>
  <g transform="translate(32 32) scale(0.78) translate(-32 -32)">
    ${art}
  </g>
</svg>`

await mkdir('public/icons', { recursive: true })
await mkdir('public', { recursive: true })

await writeFile('public/favicon.svg', rounded)

const render = (svg, size) => sharp(Buffer.from(svg)).resize(size, size).png()

await render(rounded, 192).toFile('public/icons/icon-192.png')
await render(rounded, 512).toFile('public/icons/icon-512.png')
await render(rounded, 180).toFile('public/apple-touch-icon.png')
await render(maskable, 512).toFile('public/icons/maskable-512.png')

console.log('icons generated')
