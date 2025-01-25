const http = require("http");
const app = require("./app");
const port = process.env.PORT || 3000; // Ensure the correct variable name

const server = http.createServer(app);

// Start the server
server.listen(port, () => { // Use the correct variable name 'port'
    console.log(`Server running on PORT: ${port}`);
});
