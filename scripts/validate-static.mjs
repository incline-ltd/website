#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { dirname, extname, join, normalize } from "node:path";

const root = process.cwd();

const routePages = [
  "about",
  "trading-automation",
  "ai-automation",
  "telegram-automation",
  "apps-and-bots",
  "open-source",
  "contact",
];

const required = [
  "index.html",
  "_landing/assets/favicon.ico",
  "_landing/assets/favicon.svg",
  "_landing/assets/social-card.png",
  "robots.txt",
  "sitemap.xml",
  "_landing/styles/reset.css",
  "_landing/styles/tokens.css",
  "_landing/styles/primitives.css",
  "_landing/styles/components.css",
  "_landing/styles/product-proof.css",
  "_landing/styles/product-switcher.css",
  "_landing/styles/pridie-preview.css",
  "_landing/styles/accept-user-preview.css",
  "_landing/js/site.js",
  "_landing/js/product-proof.js",
  "_landing/js/product-switcher.js",
  "_landing/js/product-previews/pridie.js",
  "_landing/js/product-previews/accept-user.js",
  "_landing/js/agent-carousel.js",
  "_landing/js/chat-demo.js",
  "_landing/js/terminal-demo.js",
  "_landing/js/route-preview.js",
  "_landing/js/case-sync.js",
  "_landing/js/contact-form.js",
  "_landing/styles/sections.css",
  ...routePages.map((route) => `${route}/index.html`),
];

const failures = [];

for (const file of required) {
  if (!existsSync(join(root, file))) {
    failures.push(`Missing required file: ${file}`);
  }
}

const files = execFileSync(
  "git",
  ["ls-files", "--cached", "--others", "--exclude-standard"],
  { encoding: "utf8" },
)
  .split("\n")
  .filter((file) => file && existsSync(join(root, file)));

for (const file of files.filter((file) => /\.(?:js|mjs)$/.test(file))) {
  try {
    execFileSync(process.execPath, ["--check", join(root, file)], { stdio: "pipe" });
  } catch {
    failures.push(`JavaScript syntax check failed: ${file}`);
  }
}

const forbidden = [
  /^\.env(?:\.|$)/,
  /^\.gitlab-ci\.yml$/,
  /^BUILD_PROMPT\.md$/,
  /(?:^|\/)deploy[^/]*\.(?:sh|py|mjs)$/,
  /\.(?:pem|key|p12|pfx|age|sqlite|db|log)$/i,
  /\.private\.md$/,
  /(^|\/)node_modules\//,
  /^angular\.json$/,
  /^package(?:-lock)?\.json$/,
  /^src\/app\//,
  /(?:^|\/)final-preview\.png$/,
  /(?:^|\/)(?:credentials?|secrets?|customer-data)(?:\/|\.|$)/i,
];

for (const file of files) {
  if (forbidden.some((pattern) => pattern.test(file))) {
    failures.push(`Forbidden static-site file: ${file}`);
  }
}

const allowedHtml = new Set([
  "index.html",
  ...routePages.map((route) => `${route}/index.html`),
]);
const htmlFiles = files.filter((file) => extname(file) === ".html");

for (const file of htmlFiles) {
  if (!allowedHtml.has(file)) {
    failures.push(`Unexpected HTML page: ${file}`);
  }
}

// Checks shared by every page: document metadata, the shared shell mounts,
// no Angular template leftovers, and no broken local asset references.
const sharedPatterns = [
  [/<html\s+lang="en"/i, 'lang="en"'],
  [/<title>[^<]+<\/title>/i, "title"],
  [/<meta\s+name="description"/i, "description"],
  [/<meta\s+name="robots"\s+content="noindex, nofollow"/i, "robots metadata"],
  [/<meta\s+name="viewport"/i, "viewport"],
  [/<link\s+rel="canonical"\s+href="https:\/\/inclineltd\.com\//i, "canonical URL"],
  [/<meta\s+property="og:title"/i, "Open Graph title"],
  [/<meta\s+property="og:description"/i, "Open Graph description"],
  [/<meta\s+property="og:url"/i, "Open Graph URL"],
  [
    /<meta\s+property="og:image"\s+content="https:\/\/inclineltd\.com\/_landing\/assets\/social-card\.png"/i,
    "Open Graph image",
  ],
  [/<meta\s+name="twitter:card"\s+content="summary_large_image"/i, "Twitter card"],
  [
    /<link\s+rel="icon"\s+href="(?:\.\/|\.\.\/)_landing\/assets\/favicon\.ico"/i,
    "ICO favicon",
  ],
  [
    /<link\s+rel="icon"\s+href="(?:\.\/|\.\.\/)_landing\/assets\/favicon\.svg"[^>]*sizes="any"/i,
    "SVG favicon",
  ],
  [/<a[^>]*class="skip-link"[^>]*href="#main-content"/i, "skip link"],
  [/<header[^>]*data-site-header[^>]*><\/header>/i, "shared header mount"],
  [
    /<main[^>]*id="main-content"[^>]*class="[^"]*\bsite-shell__main\b[^"]*"/i,
    "scrolling main",
  ],
  [/<footer[^>]*data-site-footer[^>]*hidden[^>]*><\/footer>/i, "semantic footer"],
];

const angularMarkers = [/_ngcontent-/i, /\brouterLink\b/i, /@for\s*\(/, /\[class\./, /\(click\)=/, /\{\{/];
const canonicalByFile = new Map([
  ["index.html", "https://inclineltd.com/"],
  ...routePages.map((route) => [
    `${route}/index.html`,
    `https://inclineltd.com/${route}/`,
  ]),
]);

for (const file of htmlFiles) {
  if (!allowedHtml.has(file)) continue;

  const html = readFileSync(join(root, file), "utf8");

  for (const [pattern, label] of sharedPatterns) {
    if (!pattern.test(html)) failures.push(`${file} is missing ${label}`);
  }

  const mainCount = (html.match(/<main(?:\s|>)/gi) || []).length;
  if (mainCount !== 1) {
    failures.push(`${file} must contain exactly one main element (found ${mainCount})`);
  }

  const canonical = canonicalByFile.get(file);
  if (!html.includes(`<link rel="canonical" href="${canonical}" />`)) {
    failures.push(`${file} has the wrong canonical URL`);
  }
  if (!html.includes(`<meta property="og:url" content="${canonical}" />`)) {
    failures.push(`${file} has the wrong Open Graph URL`);
  }
  if (/rel="alternate icon"/i.test(html)) {
    failures.push(`${file} uses obsolete alternate-icon markup`);
  }

  for (const marker of angularMarkers) {
    if (marker.test(html)) failures.push(`Angular template marker remains in ${file}: ${marker}`);
  }

  if (/(?:href|src)="\/(?!\/)/.test(html)) {
    failures.push(
      `${file} uses root-absolute links; use relative paths so file:// previews work`,
    );
  }

  for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const raw = match[1];
    const value = raw.split(/[?#]/)[0];
    if (!value || /^(?:https?:|tel:|data:)/.test(value)) continue;

    // Root-absolute references map to the repo root; relative ones resolve
    // against the page's own directory. Only verify concrete static files.
    const base = value.startsWith("/") ? "" : dirname(file);
    const local = normalize(join(base, value.replace(/^\//, "")));
    if (!existsSync(join(root, local)) && /\.[a-z0-9]+$/i.test(local)) {
      failures.push(`${file} has broken local reference: ${raw}`);
    }
  }
}

const sitemap = readFileSync(join(root, "sitemap.xml"), "utf8");
for (const canonical of canonicalByFile.values()) {
  const count = sitemap.split(`<loc>${canonical}</loc>`).length - 1;
  if (count !== 1) {
    failures.push(`sitemap.xml must contain ${canonical} exactly once (found ${count})`);
  }
}

const robots = readFileSync(join(root, "robots.txt"), "utf8");
if (!/^User-agent: \*\s+Disallow: \/\s*$/.test(robots)) {
  failures.push("robots.txt must keep this architecture demo out of crawler results");
}

const socialCard = readFileSync(join(root, "_landing/assets/social-card.png"));
if (
  socialCard.toString("ascii", 1, 4) !== "PNG" ||
  socialCard.readUInt32BE(16) !== 1200 ||
  socialCard.readUInt32BE(20) !== 630
) {
  failures.push("_landing/assets/social-card.png must be a 1200x630 PNG");
}

// Home-page-only checks: the typographic hero and product links.
// The hero is CSS-only by design — no 3D scene payload may return to the page.
const html = readFileSync(join(root, "index.html"), "utf8");
const organizationJson = html.match(
  /<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/i,
);

if (!organizationJson) {
  failures.push("index.html is missing Organization structured data");
} else {
  try {
    const organization = JSON.parse(organizationJson[1]);
    if (
      organization["@type"] !== "Organization" ||
      organization.name !== "Incline LTD" ||
      organization.url !== "https://inclineltd.com/"
    ) {
      failures.push("index.html has invalid Organization structured data");
    }
  } catch {
    failures.push("index.html has malformed JSON-LD");
  }
}

if (/three\.classic\.min\.js|three-scene\.js/.test(html)) {
  failures.push("index.html must not load Three.js; the hero is CSS-only");
}

if (/type="module"|system-map-three/.test(html)) {
  failures.push("index.html must stay a classic-script page with the CSS hero");
}

if (!/hero-section__proof/.test(html)) {
  failures.push("index.html hero must include the product links");
}

const heroCount = (html.match(/<section[^>]*class="[^"]*\bhero-section\b[^"]*"/gi) || []).length;
if (heroCount !== 1) {
  failures.push(`index.html must contain exactly one hero section (found ${heroCount})`);
}

// The product wall lives on the about page — once, and only there.
const aboutHtml = readFileSync(join(root, "about/index.html"), "utf8");
const proofOnAbout = (aboutHtml.match(/<section[^>]*class="[^"]*\btp\b[^"]*"/gi) || []).length;
const proofOnIndex = (html.match(/<section[^>]*class="[^"]*\btp\b[^"]*"/gi) || []).length;
if (proofOnAbout !== 1 || proofOnIndex !== 0) {
  failures.push(
    `product wall must appear exactly once on about (found about=${proofOnAbout}, index=${proofOnIndex})`,
  );
}

const contactHtml = readFileSync(join(root, "contact/index.html"), "utf8");
const contactScript = readFileSync(join(root, "_landing/js/contact-form.js"), "utf8");
const contactPatterns = [
  [/<fieldset[^>]*data-form-fields[^>]*disabled/, "disabled demo fieldset"],
  [/Nothing is sent or saved\./, "visible demo notice"],
  [/name="fullName"/, "fullName field"],
  [/name="email"/, "email field"],
  [/name="comments"/, "comments field"],
  [/name="hp"/, "honeypot field"],
];

for (const [pattern, label] of contactPatterns) {
  if (!pattern.test(contactHtml)) failures.push(`contact/index.html is missing ${label}`);
}

if (/data-endpoint|action=|formaction=/i.test(contactHtml)) {
  failures.push("The demo form must not contain a submission destination");
}
if (!contactScript.includes("event.preventDefault()") ||
    !contactScript.includes("Nothing was sent or saved.")) {
  failures.push("The contact demo must prevent submission and explain the local result");
}

const runtimeFiles = files.filter((file) => /\.(?:html|js|css)$/.test(file));
for (const file of runtimeFiles) {
  const content = readFileSync(join(root, file), "utf8");
  if (/script\.google\.com\/macros\/s\/|mailto:|[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i.test(content)) {
    failures.push(`${file} contains a contact identifier or live form destination`);
  }
  if (/\bfetch\s*\(|XMLHttpRequest|sendBeacon|WebSocket|localStorage|sessionStorage/.test(content)) {
    failures.push(`${file} contains network or storage behavior outside this static demo`);
  }
}

for (const file of files.filter((file) => /\.(?:md|html|js|mjs|css|ya?ml|xml|txt)$/.test(file))) {
  const content = readFileSync(join(root, file), "utf8");
  if (/\/Users\/|\/home\/|gitlab[-]founder|HOSTINGER[_]|-----BEGIN [A-Z ]*PRIVATE KEY-----|\bgh[pousr]_[A-Za-z0-9]{20,}|\bAKIA[A-Z0-9]{16}\b/.test(content)) {
    failures.push(`${file} contains a private path, deployment detail or credential pattern`);
  }
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(
  `Static validation passed (home + ${routePages.length} route pages checked).`,
);
