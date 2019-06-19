const http = require('http');

const server = http.createServer(function (request, response) {
    if ((request.url === '/webhook/') && (request.method === 'POST')) {
        response.writeHead(200, { "Content-Type": "text/plain" });
        response.end("POST request is detected");
    }
});

const port = process.env.PORT || 1337;
server.listen(port);

console.log("Server running at http://localhost:%d", port);
