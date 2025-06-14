const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

// Determine if we're in development or production
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

// Get the port - use Railway's PORT env var, fallback to 3000 for local development
const port = process.env.PORT || 3000;

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  })
  .listen(port, '0.0.0.0', (err) => {
    if (err) throw err;
  });
}).catch(err => {
  console.error('Error occurred starting server:');
  console.error(err);
  process.exit(1);
});
