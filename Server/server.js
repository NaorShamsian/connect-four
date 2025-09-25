const {turn} = require("./api.js");
const http = require('http');
const {URL} = require('url');
const {newGame} = require("./newGame.js");
const {state} = require("./state.js");

const server = http.createServer((req,res)=>{
    const {method,url} = req;
    const parsedUrl = new URL(url, `http://${req.headers.host}`);
    const pathname = parsedUrl.pathname;
    const query = parsedUrl.searchParams; // ?x=5

    console.log("method: ", method, " pathname: ", pathname, " query: ", query, " url: ", url)
    res.setHeader('Access-Control-Allow-Origin', '*');

    if(pathname === '/'){
        res.writeHead(200, { 'Cofntent-Type': 'text/html' });
        res.end('<h1>it is work</h1>');
    } else if(pathname === '/turn'){
        turn(method, query, res)
    } else if(pathname === '/newGame') {
        newGame(method, query, res)
    } else if(pathname === '/state') {
        state(method, query, res)
    } else {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 Not Found</h1>');
    }
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});
