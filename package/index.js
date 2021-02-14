const axios = require("axios");
const WebSocket = require("ws");

let expressPort = 1009;
let wsPort = 1010;

class db {
  constructor(params) {
    this.url = params.url;
  }
}

class dbRequest {
  constructor(requestObject) {
    this.db = requestObject.url;
    this.expressURL = "http://" + this.db + ":1009";
    this.wsURL = "ws://" + this.db + ":1010";
    this.type;
    this.path = "";
    this.callback = () => {};
  }

  async MgetOnce() {
    axios
      .post(this.expressURL + "/get-once", {
        path: this.path,
        query: this.query,
        type: this.type,
      })
      .then((res) => {
        this.callback(JSON.parse(res.data));
      })
      .catch((error) => {
        console.error(error);
      });
  }

  async MwriteFile(data) {
    axios
      .post(this.expressURL + "/write-file", {
        path: this.path,
        data: data,
      })
      .then((res) => {
        if (this.callback != undefined) {
          this.callback();
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  async MgetRealTime() {
    const ws = new WebSocket(this.wsURL);
    let parent = this;

    ws.on("open", function open() {
      ws.send(JSON.stringify({ path: parent.path }));
    });

    ws.on("message", function incoming(data) {
      parent.callback(JSON.parse(data));
    });
  }
}

db.prototype.collection = function (collection) {
  let obj = new dbRequest(this);
  if (this.request == undefined) {
    obj.path = "";
  }
  obj.path += "/" + collection;
  obj.type = "collection";
  return obj;
};
db.prototype.doc = function (doc) {
  let obj = new dbRequest(this);
  if (this.request == undefined) {
    obj.path = "";
  }
  obj.path += "/" + doc + ".json";
  obj.type = "document";
  return obj;
};

dbRequest.prototype.collection = function (collection) {
  this.path += "/" + collection;
  this.type = "collection";
  return this;
};

dbRequest.prototype.doc = function (doc) {
  this.path += "/" + doc + ".json";
  this.type = "document";
  return this;
};

dbRequest.prototype.getOnce = function (callback) {
  this.callback = callback;
  this.MgetOnce();
};

dbRequest.prototype.query = function (query) {
  this.query = query;
  this.type = "query";
  return this;
};

dbRequest.prototype.getRealTime = function (callback) {
  this.callback = callback;
  this.MgetRealTime();
};

dbRequest.prototype.writeFile = function (data, callback) {
  if (callback == undefined) {
    this.callback = () => {};
  } else {
    this.callback = callback;
  }
  this.MwriteFile(data);
};

module.exports = {
  db: db,
  dbRequest: dbRequest,
};
