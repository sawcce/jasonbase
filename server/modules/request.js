const codes = require("./http-codes");
const { cwd } = require("process");
const query = require("./query");

class request {
  constructor(req, res, type) {
    this.type = type;
    this.req = req;
    this.res = res;
    if ("path" in req.body) {
      this.path = cwd() + "/db" + req.body.path;
    }
    this.body = this.req.body;
    this.postActions = [];
  }

  setPrivileges(data) {
    this.privileges = data;
  }

  getPrivileges() {
    return this.privileges;
  }

  hasPrivilege(name) {
    return name in this.privileges;
  }

  fetchData() {
    return new Promise((resolve, reject) => {
      console.log(this.path);

      switch (this.body.type) {
        case "document":
          fs.readFile(this.path, "utf8", (err, data) => {
            if (!err) {
              resolve(data);
            } else {
              reject(404);
            }
          });
          break;
        case "query":
          query
            .executeQuery({ query: this.body.query, path: this.path })
            .then((data) => {
              resolve(data);
            });
          break;
      }
    });
  }

  switchByType({ write, read }) {
    console.log(this.type);
    switch (this.type) {
      case "get":
        read();
        break;
      case "write":
        write();
        break;
    }
  }

  write() {
    jetpack.writeAsync(path, JSON.stringify(req.body.data)).then(() => {
      res.json(JSON.stringify(this.body.data));
    });
  }

  json(data) {
    this.jsonData = data;
  }

  validate() {
    this.res.status(200);
    this.res.json({
      data: this.jsonData,
      after: this.postActions,
    });
  }

  reject(code) {
    this.res.status(code);
    let codeS = code.toString();
    console.log(codes[codeS]);
    this.res.json(codes[codeS]);
  }

  sanitize(fields) {
    fields.forEach((field) => {
      console.log(typeof this.jsonData);
      this.jsonData[field] = undefined;
    });
  }

  after() {
    let pa = this.postActions;
    return {
      changeKey(newKey) {
        console.log(pa);
        pa.push({
          type: "kc",
          nk: newKey,
        });
      },
    };
  }
}

module.exports = {
  DBrequest: request,
};
