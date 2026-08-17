// Generates optimized WebP derivatives (and video posters/compressed clips) from
// original source media into assets/derived/. Originals are never modified.
// Re-run any time the manifest below grows in a later phase.
import { execFileSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const REPO_ROOT = resolve(import.meta.dirname, '..');
const LIBRARY_ROOT = resolve(REPO_ROOT, '../Deepesh_Portfolio_Assets');
const OUT_ROOT = resolve(REPO_ROOT, 'assets/derived');

const repo = (p) => resolve(REPO_ROOT, p);
const lib = (p) => resolve(LIBRARY_ROOT, p);

function run(args) {
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', ...args], { stdio: 'inherit' });
}

function ensureDir(filePath) {
  mkdirSync(dirname(filePath), { recursive: true });
}

// image: { src, slug, widths }  -> assets/derived/<slug>-<width>.webp
function deriveImage({ src, slug, widths, quality = 82 }) {
  for (const width of widths) {
    const out = resolve(OUT_ROOT, `${slug}-${width}.webp`);
    ensureDir(out);
    run([
      '-i', src,
      '-vf', `scale='min(${width},iw)':-1:flags=lanczos`,
      '-c:v', 'libwebp', '-q:v', String(quality),
      out,
    ]);
    console.log('image  ->', out.replace(REPO_ROOT + '\\', ''));
  }
}

// poster: single frame from a video -> assets/derived/<slug>-poster-<width>.webp
function derivePoster({ src, slug, atSeconds, width, quality = 82 }) {
  const out = resolve(OUT_ROOT, `${slug}-poster-${width}.webp`);
  ensureDir(out);
  run([
    '-ss', String(atSeconds), '-i', src,
    '-frames:v', '1',
    '-vf', `scale='min(${width},iw)':-1:flags=lanczos`,
    '-c:v', 'libwebp', '-q:v', String(quality),
    out,
  ]);
  console.log('poster ->', out.replace(REPO_ROOT + '\\', ''));
}

// clip: compressed click-to-play derivative -> assets/derived/<slug>-clip.mp4
function deriveClip({ src, slug, width, crf = 31 }) {
  const out = resolve(OUT_ROOT, `${slug}-clip.mp4`);
  ensureDir(out);
  run([
    '-i', src,
    '-vf', `scale='min(${width},iw)':-2:flags=lanczos`,
    '-c:v', 'libx264', '-preset', 'slow', '-crf', String(crf),
    '-pix_fmt', 'yuv420p',
    '-c:a', 'aac', '-b:a', '96k',
    '-movflags', '+faststart',
    out,
  ]);
  console.log('clip   ->', out.replace(REPO_ROOT + '\\', ''));
}

// ---- Phase 3A manifest: hero / SHERU flagship ----
const images = [
  { src: repo('assets/sheru.png'), slug: 'sheru-envisioned', widths: [1200, 700, 420] },

  // ---- Phase 3C: SHERU case study — prototype documentation ----
  { src: repo('assets/sheru-in-testing-phase-front.png'), slug: 'sheru-prototype-front', widths: [700, 420] },
  { src: repo('assets/sheru-in-testing-phase-back.png'), slug: 'sheru-prototype-back', widths: [700, 420] },

  // ---- Phase 3B: Freelance ----
  { src: lib('04_Freelance/Moh_Zewar/MohZewar-teal-label-tag-mockup.jpg'), slug: 'moh-zewar-tag', widths: [1100, 700] },
  { src: lib('04_Freelance/Moh_Zewar/MohZewar-Box.jpg'), slug: 'moh-zewar-box', widths: [700] },
  { src: lib('04_Freelance/Moh_Zewar/moh-1.jpg'), slug: 'moh-zewar-logo', widths: [500] },
  { src: lib('04_Freelance/Book_Covers/abhivyakti.jpg'), slug: 'book-abhivyakti', widths: [340] },
  { src: lib('04_Freelance/Book_Covers/bemanirishtey.jpg'), slug: 'book-bemanirishtey', widths: [340] },
  { src: lib('04_Freelance/Book_Covers/dilkigirah.jpg'), slug: 'book-dilkigirah', widths: [340] },
  { src: lib('04_Freelance/Book_Covers/my-fm.jpg'), slug: 'book-myfm', widths: [340] },
  { src: lib('04_Freelance/Book_Covers/radio.jpg'), slug: 'book-radio', widths: [340] },
  { src: lib('04_Freelance/Metal/first.jpg'), slug: 'metal-first', widths: [420] },
  { src: lib('04_Freelance/Metal/third.jpg'), slug: 'metal-third', widths: [420] },

  // ---- Phase 3B: Digitalabs ----
  { src: lib('03_Digitalabs/GeM/GeM-Saras.jpg'), slug: 'gem-saras', widths: [900] },
  { src: lib('03_Digitalabs/GeM/GeM-Bamboo.jpg'), slug: 'gem-bamboo', widths: [500] },
  { src: lib('03_Digitalabs/GeM/Blood-Donor-Day-2.jpg'), slug: 'gem-blood-donor', widths: [500] },
  { src: lib('03_Digitalabs/GeM/Indian-Navy-2.jpg'), slug: 'gem-navy', widths: [500] },
  { src: lib('03_Digitalabs/HDFC/HDFC-ERGO-1.jpg'), slug: 'hdfc-1', widths: [420] },
  { src: lib('03_Digitalabs/HDFC/HDFC-ERGO-2.jpg'), slug: 'hdfc-2', widths: [420] },
  { src: lib('03_Digitalabs/HDFC/HDFC-ERGO-3.jpg'), slug: 'hdfc-3', widths: [420] },
  { src: lib('03_Digitalabs/Isc/Isc.jpg'), slug: 'isc-main', widths: [700] },
  { src: lib('03_Digitalabs/Isc/Isc-Model.jpg'), slug: 'isc-model', widths: [420] },
  { src: lib('03_Digitalabs/Lone_Wolf/LOne-wolf-1.jpg'), slug: 'lone-wolf-cave', widths: [560] },
  { src: lib('03_Digitalabs/Lone_Wolf/LOne-wolf-4.jpg'), slug: 'lone-wolf-forest', widths: [560] },
  { src: lib('03_Digitalabs/Maate/Maate-5.jpg'), slug: 'maate-coconut', widths: [700] },
  { src: lib('03_Digitalabs/Maate/Maate-1.jpg'), slug: 'maate-powder', widths: [420] },
  { src: lib('03_Digitalabs/NLDS/NLDS-9.jpg'), slug: 'nlds-port', widths: [500] },
  { src: lib('03_Digitalabs/NLDS/NLDS-5.jpg'), slug: 'nlds-yard', widths: [500] },
  { src: lib('03_Digitalabs/NLDS/NLDS-1.jpg'), slug: 'nlds-ocean', widths: [500] },
  { src: lib('03_Digitalabs/NLDS/NLDS-2.jpg'), slug: 'nlds-corridor', widths: [500] },

  // ---- Phase 3B: afaqs! ----
  // afaqs-mailer (02_Afaqs/mailer.jpg) retired: general traffic-stat graphic,
  // not tied to a specific event — excluded per Phase 3D visual audit.
  { src: lib('02_Afaqs/Events/Buzzies/mailer-13.jpg'), slug: 'afaqs-buzzies', widths: [420] },
  { src: lib('02_Afaqs/Events/Digipub/01-08-2018-fb.jpg'), slug: 'afaqs-digipub', widths: [420] },
  { src: lib('02_Afaqs/Events/foxglove/mailer1.jpg'), slug: 'afaqs-foxglove', widths: [420] },

  // ---- Phase 4: media-proportion correction pass — Metal third screen ----
  { src: lib('04_Freelance/Metal/second.jpg'), slug: 'metal-second', widths: [420] },

  // ---- Phase 5: project composition refinement — GeM fourth supporting image ----
  { src: lib('03_Digitalabs/GeM/274720314_2935571260067565_7163978631895211480_n.jpg'), slug: 'gem-selfhelp', widths: [500] },
];

const posters = [
  { src: lib('01_THIP/Video_Motion/Thip.mp4'), slug: 'thip', atSeconds: 6, width: 900 },
  { src: lib('01_THIP/Video_Motion/Thip.mp4'), slug: 'thip', atSeconds: 6, width: 500 },
  { src: lib("03_Digitalabs/Smaaash/Go_Smaaash_women's day.mp4"), slug: 'smaaash', atSeconds: 45, width: 700 },
  { src: lib("03_Digitalabs/Smaaash/Go_Smaaash_women's day.mp4"), slug: 'smaaash', atSeconds: 45, width: 420 },

  // ---- Phase 3D: afaqs! event videos ----
  { src: lib('02_Afaqs/Events/Buzzies/buzzies2018.mp4'), slug: 'afaqs-buzzies', atSeconds: 4, width: 700 },
  { src: lib('02_Afaqs/Events/Buzzies/buzzies2018.mp4'), slug: 'afaqs-buzzies', atSeconds: 4, width: 420 },
  { src: lib('02_Afaqs/Events/Digipub/Digipub-Awards.mp4'), slug: 'afaqs-digipub', atSeconds: 30, width: 900 },
  { src: lib('02_Afaqs/Events/Digipub/Digipub-Awards.mp4'), slug: 'afaqs-digipub', atSeconds: 30, width: 700 },
  { src: lib('02_Afaqs/Events/Digipub/Digipub-Awards.mp4'), slug: 'afaqs-digipub', atSeconds: 30, width: 420 },
  { src: lib('02_Afaqs/Events/foxglove/what is foxglove2019.mp4'), slug: 'afaqs-foxglove', atSeconds: 3, width: 700 },
  { src: lib('02_Afaqs/Events/foxglove/what is foxglove2019.mp4'), slug: 'afaqs-foxglove', atSeconds: 3, width: 420 },
  { src: lib('02_Afaqs/Events/vdonxt/vdonxt-tv-ad.mp4'), slug: 'afaqs-vdonxt', atSeconds: 2.5, width: 700 },
  { src: lib('02_Afaqs/Events/vdonxt/vdonxt-tv-ad.mp4'), slug: 'afaqs-vdonxt', atSeconds: 2.5, width: 420 },

  // ---- Phase 4: media-proportion correction pass — Maate + Moh Zewar motion work ----
  { src: lib('03_Digitalabs/Maate/Maate-1.mp4'), slug: 'maate-brand', atSeconds: 4, width: 700 },
  { src: lib('03_Digitalabs/Maate/Maate-2.mp4'), slug: 'maate-social', atSeconds: 1, width: 420 },
  { src: lib('04_Freelance/Moh_Zewar/PreferredOne.mp4'), slug: 'moh-zewar-motion', atSeconds: 6, width: 700 },

  // ---- Phase 5: project composition refinement — Smaaash reels + Lone Wolf video ----
  { src: lib('03_Digitalabs/Smaaash/Go_Smaaash.mp4'), slug: 'smaaash-reel1', atSeconds: 3, width: 300 },
  { src: lib('03_Digitalabs/Smaaash/Go_Smaaash_2.mp4'), slug: 'smaaash-reel2', atSeconds: 3, width: 300 },
  { src: lib('03_Digitalabs/Lone_Wolf/LOne-wolf.mp4'), slug: 'lone-wolf', atSeconds: 3, width: 560 },
];

const clips = [
  { src: lib('01_THIP/Video_Motion/Thip.mp4'), slug: 'thip', width: 560 },
  { src: lib("03_Digitalabs/Smaaash/Go_Smaaash_women's day.mp4"), slug: 'smaaash', width: 380 },

  // ---- Phase 3D: afaqs! event videos ----
  { src: lib('02_Afaqs/Events/Buzzies/buzzies2018.mp4'), slug: 'afaqs-buzzies', width: 640 },
  { src: lib('02_Afaqs/Events/Digipub/Digipub-Awards.mp4'), slug: 'afaqs-digipub', width: 900 },
  { src: lib('02_Afaqs/Events/foxglove/what is foxglove2019.mp4'), slug: 'afaqs-foxglove', width: 640 },
  { src: lib('02_Afaqs/Events/vdonxt/vdonxt-tv-ad.mp4'), slug: 'afaqs-vdonxt', width: 640 },

  // ---- Phase 4: media-proportion correction pass — Maate + Moh Zewar motion work ----
  { src: lib('03_Digitalabs/Maate/Maate-1.mp4'), slug: 'maate-brand', width: 700 },
  { src: lib('03_Digitalabs/Maate/Maate-2.mp4'), slug: 'maate-social', width: 420 },
  { src: lib('04_Freelance/Moh_Zewar/PreferredOne.mp4'), slug: 'moh-zewar-motion', width: 700 },

  // ---- Phase 5: project composition refinement — Smaaash reels + Lone Wolf video ----
  { src: lib('03_Digitalabs/Smaaash/Go_Smaaash.mp4'), slug: 'smaaash-reel1', width: 300 },
  { src: lib('03_Digitalabs/Smaaash/Go_Smaaash_2.mp4'), slug: 'smaaash-reel2', width: 300 },
  { src: lib('03_Digitalabs/Lone_Wolf/LOne-wolf.mp4'), slug: 'lone-wolf', width: 560 },
];

for (const item of images) deriveImage(item);
for (const item of posters) derivePoster(item);
for (const item of clips) deriveClip(item);

console.log(`Done: ${images.length} image set(s), ${posters.length} poster(s), ${clips.length} clip(s).`);
