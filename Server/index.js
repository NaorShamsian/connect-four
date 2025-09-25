
let counter = 1;
let http = require('http');
http.createServer((req,res)=> {
    console.log("we have a new client.." + counter++)

    res.writeHead(200, {'Content-Type':'text/plain'});
    res.end("hello client " + counter +" how do you do ?")
}).listen(3000,()=>{console.log("Now listening to port 3000..");});