const http = require('http');
const path = require('path');
const fs = require('fs');

const server = http.createServer( (req, res ) => {
 /*
    if(req.url === '/'){

        fs.readFile(path.join(__dirname,'public','index.html'), (err, content) => {
            if(err) throw err;
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(content);

        })
        
    }
    
    //hard code i dati, non è fatto bene per niente
    if(req.url === '/api/users'){

        const users = [
            {
                name: 'Bob smith',
                age: 40
            },
            {
                name: 'Bla bla',
                age: 30
            }
        ];
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(users));
    }
    */


    // Build file path
    let filePath = path.join(
        __dirname,
        'public', 
        req.url === '/' ? 'index.html' : req.url
    );
    
    // Extension of file
    let extname = path.extname(filePath);

    //Initial content type
    let contentType = 'text/html';

    //Check ext and set content type
    switch(extname){
        case '.js': contentType = 'text/javascript'; break;
        case '.css': contentType = 'text/css'; break;
        case '.json': contentType = 'application/json'; break;
        case '.png': contentType = 'image/png'; break;
        case '.jpg': contentType = 'image/jpg'; break;
    }


    // Read file
        fs.readFile(filePath, (err, content) => {
            console.dir(req.params);
            if(err){
                if(err.code == 'ENOENT'){
                    //Page not found
                    fs.readFile(path.join(__dirname, 'public', '404.html'),
                    (err, content) => {
                        res.writeHead(200, {'Content-Type': 'text/html'});
                        res.end(content, 'utf8');
                    })
                }else{
                    // Some server error
                    res.writeHead(500);
                    res.end(`Server Error: ${err.code}`);
                }
            }else{
                // Succes
                res.writeHead(200, {'Content-Type': contentType});
                res.end(content, 'utf8');
            }
        });

    if (req.method == "GET")
    {
        fs.readFile(filePath, (err, content) => {
            console.dir(req.params);
            if(err){
                if(err.code == 'ENOENT'){
                    //Page not found
                    fs.readFile(path.join(__dirname, 'public', '404.html'),
                    (err, content) => {
                        res.writeHead(200, {'Content-Type': 'text/html'});
                        res.end(content, 'utf8');
                    })
                }else{
                    // Some server error
                    res.writeHead(500);
                    res.end(`Server Error: ${err.code}`);
                }
            }else{
                // Succes
                res.writeHead(200, {'Content-Type': contentType});
                res.end(content, 'utf8');
            }
        });
    }else if(req.method=="POST"){

        let body ='';
        let bodyObj = [];
        req.on('data', function(data){
            body += data;
            bodyObj = JSON.parse(data);
            bodyObj.userId = 9;
            fs.readFile(filePath, function (err, dataFile) {
                var json = JSON.parse(dataFile);
                bodyObj.id = json.length + 1;
                json.push(bodyObj);
                fs.writeFile(filePath, JSON.stringify(json), err => {
                    if(err) throw err;
                });
            });
        });
        req.on('end', function() {
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify(bodyObj));
        });
    }else if(req.method=="DELETE"){
        req.on('data', function(data){

            fs.readFile(filePath, function (err, dataFile) {
                var json = JSON.parse(dataFile);
                const id = JSON.parse(data);
                let ogg = Array.from(json);

                fs.writeFile(filePath, JSON.stringify(ogg.filter(el => el.id !== id)), err => {
                    if(err) throw err;

                });
            });
        });
        req.on('end', function() {
            console.log("Successfully removed");
        });
    }else if(req.method === 'PUT'){
        req.on('data', function(data){

            fs.readFile(filePath, function (err, dataFile) {
                /* the data value is a string ? */
                var json = JSON.parse(dataFile);
                let id = data;
                id = String(data).split(":")[1];
                id = id.substring(0,id.length -1);
                let ogg = Array.from(json);
                ogg.forEach( el => {
                    if(el.id == id){
                        el.completed = !el.completed;
                    }
                })

                fs.writeFile(filePath, JSON.stringify(ogg), err => {
                    if(err) throw err;

                });
            });
        });
        req.on('end', function() {
            console.log("Successfully updated");
        });
    }


});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}` ));