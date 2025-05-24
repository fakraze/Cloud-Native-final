const http = require('http');
const server = http.createServer((req, res) => {
  res.end('Hello from Backend');
});
server.listen(3000);
console.log("Dummy backend running on port 3000");
