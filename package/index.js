const axios = require('axios')

export class DataBase {
    constructor(url){
        this.url = url
    }
}

export class dbRequest {
    constructor (requestObject,path,callback){
        console.log(requestObject)
        this.db = requestObject.url
        this.path = path
        this.callback = callback
    }

    async getOnce() { 
        axios
        .post(this.db+"/get-once", {
            path: this.path
        })
        .then(res => {
            this.callback(JSON.parse(res.data))
        })
        .catch(error => {
            console.error(error)
        })
    }

    async writeFile(data) {
        axios
        .post(this.db+"/write-file", {
            path: this.path,
            data: data
        })
        .then(res => {
            if(this.callback != undefined){
                this.callback()
            }
        })
        .catch(error => {
            console.error(error)
        })

    }
}

Object.prototype.collection = function(collection) {
    let obj = {url:this.url,request:this.request}
    if(this.request == undefined){this.request = ""}
    this.request += "/"+collection
    return this
}

Object.prototype.doc = function(doc) {
    let obj = {url:this.url,request:this.request}
    if(obj.request == undefined){obj.request = ""}
    obj.request += "/"+doc+".json"
    return obj
}

Object.prototype.getOnce = function(callback) {
    new dbRequest(db,this.request,callback).getOnce()
}

Object.prototype.writeFile = function(data,callback) {
    new dbRequest(this,this.request,callback).writeFile(data)
}