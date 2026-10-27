/**
 * Automated Production Testing & Validation Suite for KB Dental
 * Pure Node.js (Zero external dependencies)
 */

const fs = require('fs');
const path = require('path');
const http = require('http');

const ROOT_DIR = path.resolve(__dirname, '..');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  \x1b[32m✔\x1b[0m ${message}`);
  } else {
    failedTests++;
    console.error(`  \x1b[31m✖\x1b[0m ${message}`);
  }
}

console.log('\n======================================================');
console.log('   KB DENTAL — AUTOMATED LOCAL TEST & AUDIT SUITE');
console.log('======================================================\n');

// 1. File Structure & Assets Verification
console.log('\x1b[1m[Suite 1] File Structure & Assets Integrity\x1b[0m');
const requiredFiles = [
  'index.html',
  '404.html',
  'sitemap.xml',
  'robots.txt',
  '_headers',
  '_redirects',
  'package.json',
  'server.js',
  'assets/css/styles.css',
  'assets/js/main.js',
  'assets/images/logo.svg',
  'assets/images/favicon.svg',
  'assets/images/hero-illustration.svg',
  'assets/images/diagram-kathmandu-valley.svg',
  'assets/images/service-rct.svg',
  'assets/images/service-braces.svg',
  'assets/images/service-implants.svg',
  'assets/images/service-cleaning.svg',
  'assets/images/service-crowns.svg',
  'assets/images/service-filling.svg',
  'services/index.html',
  'services/root-canal-treatment-rct/index.html',
  'services/braces-orthodontics/index.html',
  'services/dental-implants/index.html',
  'services/teeth-cleaning-scaling/index.html',
  'services/dental-crown-cap/index.html',
  'services/tooth-filling/index.html',
  'locations/index.html',
  'locations/kathmandu/index.html',
  'locations/lalitpur/index.html',
  'locations/bhaktapur-thimi/index.html',
  'locations/baneshwor/index.html',
  'locations/maharajgunj/index.html',
  'about/index.html',
  'contact/index.html',
  'blog/index.html',
  'blog/what-to-do-in-a-dental-emergency-kathmandu/index.html',
  'blog/dental-treatment-cost-factors-nepal/index.html',
  'privacy-policy/index.html',
  'terms/index.html'
];

for (const file of requiredFiles) {
  const fullPath = path.join(ROOT_DIR, file);
  assert(fs.existsSync(fullPath) && fs.statSync(fullPath).size > 0, `File exists & non-empty: ${file}`);
}

// 2. Discover all HTML files
function getHtmlFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const item of list) {
    const full = path.join(dir, item);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      if (item !== 'node_modules' && item !== '.git') {
        results = results.concat(getHtmlFiles(full));
      }
    } else if (item.endsWith('.html')) {
      results.push(full);
    }
  }
  return results;
}

const allHtmlFiles = getHtmlFiles(ROOT_DIR);
console.log(`\n\x1b[1m[Suite 2] HTML SEO & Metadata Standards (${allHtmlFiles.length} pages)\x1b[0m`);

let allHtmlPassed = true;
for (const file of allHtmlFiles) {
  const rel = path.relative(ROOT_DIR, file);
  const content = fs.readFileSync(file, 'utf-8');

  const hasDoctype = content.includes('<!DOCTYPE html>');
  const hasViewport = content.includes('name="viewport"');
  const hasTitle = /<title>[^<]+<\/title>/.test(content);
  const hasMetaDesc = /name="description"\s+content="[^"]+"/.test(content);
  const hasCanonical = file.includes('404.html') || /<link\s+rel="canonical"\s+href="https:\/\/kbdental\.xyz\/[^"]*"/.test(content);
  const hasPhone = file.includes('privacy-policy') || file.includes('terms') || content.includes('9815885859');

  if (!hasDoctype || !hasViewport || !hasTitle || !hasMetaDesc || !hasCanonical || !hasPhone) {
    allHtmlPassed = false;
    assert(false, `SEO tags check failed on ${rel}`);
  }
}
if (allHtmlPassed) {
  assert(true, `All ${allHtmlFiles.length} HTML pages satisfy DOCTYPE, viewport, title, meta description, and canonical tags`);
}

// 3. Link Checker & Internal Resolution
console.log('\n\x1b[1m[Suite 3] Internal Link Crawl & Zero Broken Links\x1b[0m');
let brokenLinks = 0;
const hrefRegex = /href=["']([^"']+)["']/g;

for (const file of allHtmlFiles) {
  const rel = path.relative(ROOT_DIR, file);
  const content = fs.readFileSync(file, 'utf-8');
  let match;
  while ((match = hrefRegex.exec(content)) !== null) {
    const rawHref = match[1];
    if (rawHref.startsWith('/') && !rawHref.startsWith('//')) {
      const cleanPath = rawHref.split('#')[0].split('?')[0];
      let targetFile;
      if (cleanPath === '/' || cleanPath === '') {
        targetFile = path.join(ROOT_DIR, 'index.html');
      } else {
        const direct = path.join(ROOT_DIR, cleanPath);
        if (fs.existsSync(direct) && fs.statSync(direct).isFile()) {
          targetFile = direct;
        } else if (fs.existsSync(path.join(direct, 'index.html'))) {
          targetFile = path.join(direct, 'index.html');
        } else {
          targetFile = direct;
        }
      }
      if (!fs.existsSync(targetFile)) {
        brokenLinks++;
        console.error(`    Broken link in ${rel}: ${rawHref} (cannot find ${targetFile})`);
      }
    }
  }
}
assert(brokenLinks === 0, `All internal links resolve correctly (Broken links count: ${brokenLinks})`);

// 4. Schema JSON-LD Validation
console.log('\n\x1b[1m[Suite 4] Schema.org JSON-LD Structured Data Validation\x1b[0m');
let jsonLdValid = true;
const scriptRegex = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g;

for (const file of allHtmlFiles) {
  const rel = path.relative(ROOT_DIR, file);
  const content = fs.readFileSync(file, 'utf-8');
  let sMatch;
  while ((sMatch = scriptRegex.exec(content)) !== null) {
    try {
      const parsed = JSON.parse(sMatch[1]);
      if (!parsed['@context'] && !parsed['@graph']) {
        jsonLdValid = false;
        console.error(`    Schema missing @context in ${rel}`);
      }
    } catch (e) {
      jsonLdValid = false;
      console.error(`    Invalid JSON-LD syntax in ${rel}: ${e.message}`);
    }
  }
}
assert(jsonLdValid, 'All Schema.org JSON-LD structured data blocks are valid and parseable');

// 5. Contextual Authority Linking Audit
console.log('\n\x1b[1m[Suite 5] Homepage Authority Linking Audit\x1b[0m');
const serviceAndLocationPages = allHtmlFiles.filter(f => f.includes('/services/') || f.includes('/locations/'));
let allLinkBack = true;

for (const file of serviceAndLocationPages) {
  const rel = path.relative(ROOT_DIR, file);
  const content = fs.readFileSync(file, 'utf-8');
  // Check if contains anchor linking to "/" with dental anchor text
  const linkMatches = [...content.matchAll(/<a[^>]+href=["']\/["'][^>]*>(.*?)<\/a>/gi)];
  const hasContextualLink = linkMatches.some(m => {
    const text = m[1].toLowerCase();
    return text.includes('dentist') || text.includes('dental') || text.includes('kb dental');
  });

  if (!hasContextualLink) {
    allLinkBack = false;
    console.error(`    Missing contextual homepage authority link in ${rel}`);
  }
}
assert(allLinkBack, `All ${serviceAndLocationPages.length} service and location pages contain contextual links to the homepage`);

// 6. Live HTTP Server & Endpoint Tests
console.log('\n\x1b[1m[Suite 6] Live HTTP Emulation & Endpoint Tests\x1b[0m');
const server = require('../server.js');
const TEST_PORT = 3099;

server.listen(TEST_PORT, async () => {
  function makeRequest(reqPath) {
    return new Promise((resolve) => {
      http.get(`http://localhost:${TEST_PORT}${reqPath}`, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          resolve({ status: res.statusCode, headers: res.headers, body: data });
        });
      }).on('error', err => {
        resolve({ error: err });
      });
    });
  }

  try {
    // Test 1: Homepage 200
    const homeRes = await makeRequest('/');
    assert(homeRes.status === 200 && homeRes.body.includes('KB Dental'), 'GET / returns 200 OK with homepage content');
    assert(homeRes.headers['x-content-type-options'] === 'nosniff', 'GET / returns security header X-Content-Type-Options: nosniff');
    assert(homeRes.headers['x-frame-options'] === 'SAMEORIGIN', 'GET / returns security header X-Frame-Options: SAMEORIGIN');

    // Test 2: Sub-service page
    const rctRes = await makeRequest('/services/root-canal-treatment-rct/');
    assert(rctRes.status === 200 && rctRes.body.includes('Root Canal Treatment'), 'GET /services/root-canal-treatment-rct/ returns 200 OK');

    // Test 3: Location page
    const locRes = await makeRequest('/locations/kathmandu/');
    assert(locRes.status === 200 && locRes.body.includes('Central Kathmandu'), 'GET /locations/kathmandu/ returns 200 OK');

    // Test 4: Base address location page
    const thimiRes = await makeRequest('/locations/bhaktapur-thimi/');
    assert(thimiRes.status === 200 && thimiRes.body.includes('Madhyapur Thimi'), 'GET /locations/bhaktapur-thimi/ returns 200 OK');

    // Test 5: Cloudflare Pages clean redirect emulation from _redirects
    const redirRes = await makeRequest('/rct/');
    assert(redirRes.status === 301 && redirRes.headers['location'] === '/services/root-canal-treatment-rct/', 'GET /rct/ executes 301 redirect to /services/root-canal-treatment-rct/');

    const redirLocRes = await makeRequest('/kathmandu/');
    assert(redirLocRes.status === 301 && redirLocRes.headers['location'] === '/locations/kathmandu/', 'GET /kathmandu/ executes 301 redirect to /locations/kathmandu/');

    // Test 6: 404 handling
    const notFoundRes = await makeRequest('/non-existent-page-test-12345/');
    assert(notFoundRes.status === 404 && notFoundRes.body.includes('Page Not Found'), 'GET /non-existent-route/ returns 404 with custom 404.html template');

    // Test 7: Sitemap and Robots
    const sitemapRes = await makeRequest('/sitemap.xml');
    assert(sitemapRes.status === 200 && sitemapRes.body.includes('<loc>https://kbdental.xyz/</loc>'), 'GET /sitemap.xml returns valid XML sitemap');

    const robotsRes = await makeRequest('/robots.txt');
    assert(robotsRes.status === 200 && robotsRes.body.includes('Sitemap: https://kbdental.xyz/sitemap.xml'), 'GET /robots.txt returns valid crawler configuration');

    // Test 8: Static asset caching header
    const logoRes = await makeRequest('/assets/images/logo.svg');
    assert(logoRes.status === 200 && logoRes.headers['cache-control'] && logoRes.headers['cache-control'].includes('max-age=31536000'), 'GET /assets/* serves with 1-year immutable cache header');

  } catch (err) {
    console.error('Error during HTTP testing:', err);
  } finally {
    server.close(() => {
      console.log('\n======================================================');
      console.log(`   TOTAL TESTS: ${totalTests}`);
      console.log(`   PASSED:      \x1b[32m${passedTests}\x1b[0m`);
      console.log(`   FAILED:      ${failedTests > 0 ? `\x1b[31m${failedTests}\x1b[0m` : '\x1b[32m0\x1b[0m'}`);
      console.log('======================================================\n');
      if (failedTests > 0) {
        process.exit(1);
      } else {
        process.exit(0);
      }
    });
  }
});
