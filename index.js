const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const rootDir = __dirname;
const frontendDir = path.join(rootDir, 'frontend');
const staticDir = path.join(rootDir, 'static');
const mimeTypes = {
    '.css': 'text/css; charset=utf-8',
    '.html': 'text/html; charset=utf-8',
    '.jpeg': 'image/jpeg',
    '.jpg': 'image/jpeg',
    '.js': 'text/javascript; charset=utf-8',
    '.png': 'image/png',
    '.svg': 'image/svg+xml',
    '.webp': 'image/webp'
};

function resolveFile(root, requestPath) {
    const relativePath = decodeURIComponent(requestPath).replace(/^[/\\]+/, '');
    const filePath = path.resolve(root, relativePath);
    const relative = path.relative(root, filePath);

    if (relative.startsWith('..') || path.isAbsolute(relative)) {
        return null;
    }

    return filePath;
}

const server = http.createServer((request, response) => {
    let pathname;

    try {
        pathname = new URL(request.url, 'http://localhost').pathname;
    } catch {
        response.writeHead(400).end('Bad Request');
        return;
    }

    const isStaticFile = pathname.startsWith('/static/');
    const root = isStaticFile ? staticDir : frontendDir;
    const relativePath = isStaticFile ? pathname.slice('/static/'.length) : pathname === '/' ? 'home.html' : pathname;
    let filePath;

    try {
        filePath = resolveFile(root, relativePath);
    } catch {
        response.writeHead(400).end('Bad Request');
        return;
    }

    if (!filePath) {
        response.writeHead(403).end('Forbidden');
        return;
    }

    fs.readFile(filePath, (error, content) => {
        if (error) {
            response.writeHead(error.code === 'ENOENT' ? 404 : 500).end(
                error.code === 'ENOENT' ? 'Not Found' : 'Internal Server Error'
            );
            return;
        }

        response.writeHead(200, {
            'Content-Type': mimeTypes[path.extname(filePath).toLowerCase()] || 'application/octet-stream'
        });
        response.end(content);
    });
});

const port = Number(process.env.PORT) || 3000;
server.listen(port, '127.0.0.1', () => {
    console.log(`Frontend is available at http://localhost:${port}`);
});
