const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const port = 1009
const fs = require("fs");
const ws = require("ws")
const server = new ws.Server({port:1010})
const { cwd } = require('process');
const jetpack = require('fs-jetpack');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

app.post('/get-once', (req, res) => {
    let path = cwd()+"/db"+req.body.path
    fs.readFile(path, 'utf8',(err, data) =>{
        res.json(data)
    })
})

app.post('/write-file', (req, res) => {
    let path = cwd()+"/db"+req.body.path
    jetpack.writeAsync(path, JSON.stringify(req.body.data))
    .then(() =>{
        res.json(JSON.stringify(req.body.data))
    })
})

server.on('connection', socket => {
    socket.on('message', function incoming(message) {
        console.log('Asked to watch file : ', message);
        let path = cwd()+"/db"+JSON.parse(message).path
        jetpack.readAsync(path)
        .then((data) => {
            console.log(data);
            socket.send(JSON.stringify({previousMT:undefined,currentMT:undefined,data:data}))
            
            fs.watchFile(path, (curr, prev) => { 
                jetpack.readAsync(path)
                .then((data) => {
                    console.log(data);
                    socket.send(JSON.stringify({previousMT:prev.mtime,currentMT:curr.mtime,data:data}))
                });
            }); 
        });
      }); 
    });

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})