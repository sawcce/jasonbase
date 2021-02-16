const { json } = require("body-parser");
var jetpack = require("fs-jetpack");

module.exports = {
  executeOperator({ operator, value, operatorVal, data }) {
    switch (operator) {
      case "smaller":
        return data[value] < operatorVal;
        break;
      case "greater":
        return data[value] > operatorVal;
        break;

      case "equals":
        return data[value] == operatorVal;
        break;
    }
  },

  async executeTest({ query, data }) {
    return new Promise((resolve, reject) => {
      var call = Object.keys(query)[0];
      var params = Object.entries(query)[0][1];

      var operator = Object.keys(params)[0];
      var operatorVal = Object.values(params);

      var isTrue = this.executeOperator({
        operator: operator,
        value: call,
        operatorVal: operatorVal,
        data: data,
      });
      resolve(isTrue);
    });
  },

  async executeRootTest({ query, data }) {
    return new Promise((resolve, reject) => {
      var call = Object.keys(query)[0];
      var params = Object.entries(query)[0][1];

      switch (call) {
        case "where":
          this.executeTest({ query: params, data: data }).then((isTrue) => {
            if (isTrue) {
              resolve(data);
            } else {
              resolve("undefined");
            }
          });
          break;
      }
    });
  },

  async executeQuery({ query, path = "", data }) {
    return new Promise((resolve, reject) => {
      let fetchedData = [];
      var call = Object.keys(query)[0];
      var params = Object.entries(query)[0][1];

      switch (call) {
        case "allInstances":
          jetpack.listAsync(path).then((files) => {
            for (let i = 0; i < files.length; i++) {
              let fileName = files[i];
              let rdata = jetpack.read(path + "/" + fileName);
              let data = JSON.parse(rdata);

              this.executeRootTest({
                query: params,
                data: data,
              }).then((fData) => {
                if (fData != "undefined") {
                  fetchedData.push(fData);
                } else {
                }

                if (i === files.length - 1) {
                  resolve(fetchedData);
                }
              });
            }
          });
          break;
      }
    });
  },
};
