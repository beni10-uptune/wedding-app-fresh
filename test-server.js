const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  console.log(`Request received: ${req.method} ${req.url}`);
  
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(`
    <html>
      <head><title>Test Server</title></head>
      <body>
        <h1>Test Server is Working!</h1>
        <p>Time: ${new Date().toISOString()}</p>
        <p>If you can see this, Node.js servers work on your system.</p>
        <p>Next.js should also work.</p>
      </body>
    </html>
  `);
});

server.listen(3002, '0.0.0.0', () => {
  console.log('Test server running on http://localhost:3002');
  console.log('Press Ctrl+C to stop');
});