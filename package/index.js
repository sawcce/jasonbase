const axios = require("axios");
const WebSocket = require("ws");
const { DBrequest } = require("../server/modules/request");

let expressPort = 1009;
let wsPort = 1010;

class db {
  constructor({ url, key }) {
    this.url = url;
    this.key = key;
  }
}

class dbRequest {
  constructor(requestObject) {
    this.refObj = requestObject;
    this.db = requestObject.url;
    this.key = requestObject.key;
    this.expressURL = "http://" + this.db + ":1009";
    this.wsURL = "ws://" + this.db + ":1010";
    this.type;
    this.path = "";
    this.callback = () => {};
  }

  async runActions(actions) {
    actions.forEach((action) => {
      switch (action.type) {
        case "kc":
          this.refObj.key = action.nk.toString();
          break;
      }
    });
  }

  async MgetOnce() {
    return new Promise((resolve, reject) => {
      axios
        .post(this.expressURL + "/get-once", {
          path: this.path,
          query: this.query,
          type: this.type,
          key: this.key,
        })
        .then((res) => {
          resolve(JSON.parse(res.data));
        })
        .catch((error) => {
          reject(error.response.data);
        });
    });
  }

  async MwriteFile(data) {
    return new Promise((resolve, reject) => {
      axios
        .post(this.expressURL + "/write-file", {
          path: this.path,
          data: data,
          key: this.key,
        })

        .then((res) => {
          resolve(JSON.parse(res.data));
        })
        .catch((error) => {
          reject(error.response.data);
        });
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

  async MCall(name, params) {
    return new Promise((resolve, reject) => {
      axios
        .post(this.expressURL + "/call", {
          name: name,
          params: params,
          key: this.key,
        })

        .then((res) => {
          this.runActions(res.data.after);
          resolve(res.data.data);
        })
        .catch((error) => {
          reject(error.response.data);
        });
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

db.prototype.execute = function (name, args) {
  let obj = new dbRequest(this);
  return obj.MCall(name, args);
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
  //this.callback = callback;
  return this.MgetOnce();
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
  return this.MwriteFile(data);
};

module.exports = {
  db: db,
  dbRequest: dbRequest,
};
