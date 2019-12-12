const http = require('http');

// Create server object
// per vederlo, devi fare una richiesta.. quindi nel browser
// localhost:5000
http.createServer( (req, res) => {
    //Write a response
    res.write('Hello World');
    res.end()
}).listen(5000, () => console.log('Server running...'));