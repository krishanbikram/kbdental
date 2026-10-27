/**
 * KB Dental — Local Development & Cloudflare Pages Emulation Server
 * Pure Node.js (Zero external dependencies)
 * Emulates Cloudflare Pages routing, _headers, and _redirects
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;
const ROOT_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.ico': 'image/x-icon',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp'
};

// 1. Parse _redirects
const redirects = [];
const redirectsPath = path.join(ROOT_DIR, '_redirects');
if (fs.existsSync(redirectsPath)) {
  const lines = fs.readFileSync(redirectsPath, 'utf-8').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const parts = trimmed.split(/\s+/);
    if (parts.length >= 2) {
      redirects.push({
        from: parts[0],
        to: parts[1],
        status: parseInt(parts[2] || '301', 10)
      });
    }
  }
}

// 2. Parse _headers
const headersRules = [];
const headersPath = path.join(ROOT_DIR, '_headers');
if (fs.existsSync(headersPath)) {
  const content = fs.readFileSync(headersPath, 'utf-8');
  const sections = content.split(/\n(?=\S)/);
  for (const section of sections) {
    const lines = section.trim().split('\n');
    const pathPattern = lines[0].trim();
    if (!pathPattern || pathPattern.startsWith('#')) continue;
    const headers = {};
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line || line.startsWith('#')) continue;
      const colonIdx = line.indexOf(':');
      if (colonIdx > 0) {
        const key = line.slice(0, colonIdx).trim();
        const val = line.slice(colonIdx + 1).trim();
        headers[key] = val;
      }
    }
    headersRules.push({ pattern: pathPattern, headers });
  }
}

function applyHeaders(res, pathname) {
  for (const rule of headersRules) {
    let match = false;
    if (rule.pattern === '/*') {
      match = true;
    } else if (rule.pattern.endsWith('/*')) {
      const prefix = rule.pattern.slice(0, -2);
      match = pathname.startsWith(prefix);
    } else {
      match = pathname === rule.pattern;
    }
    if (match) {
      for (const [k, v] of Object.entries(rule.headers)) {
        res.setHeader(k, v);
      }
    }
  }
}

const server = http.createServer((req, res) => {
  const reqUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  let pathname = decodeURIComponent(reqUrl.pathname);

  // Apply security and cache headers
  applyHeaders(res, pathname);

  // Check redirects from _redirects
  for (const redir of redirects) {
    if (pathname === redir.from || (redir.from.endsWith('/') && pathname + '/' === redir.from)) {
      res.writeHead(redir.status, { Location: redir.to });
      res.end();
      return;
    }
  }

  // Resolve file path
  let filePath = path.join(ROOT_DIR, pathname);

  // Directory resolution
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  } else if (!fs.existsSync(filePath)) {
    // Try adding .html
    if (fs.existsSync(filePath + '.html')) {
      filePath = filePath + '.html';
    } else if (fs.existsSync(path.join(filePath, 'index.html'))) {
      filePath = path.join(filePath, 'index.html');
    }
  }

  // If file exists, serve it
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
    return;
  }

  // 404 Fallback
  const notFoundPath = path.join(ROOT_DIR, '404.html');
  if (fs.existsSync(notFoundPath)) {
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    fs.createReadStream(notFoundPath).pipe(res);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found');
  }
});

if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`\n==================================================`);
    console.log(`  KB Dental Local Dev Server Running!`);
    console.log(`  URL: http://localhost:${PORT}/`);
    console.log(`  Cloudflare Pages Routing & Headers Emulated`);
    console.log(`==================================================\n`);
  });
}

module.exports = server;

