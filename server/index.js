const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const port = 1009
const fs = require("fs");
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

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})