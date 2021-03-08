var jetpack = require("fs-jetpack");
const shared = require("./shared.js");

module.exports = {
  executeOperator({ operator, value, operatorVal, data, params }) {
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
      case "equalsLarge":
        var rawData = data[value];
        rawData = rawData.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
        var rOpVal = operatorVal.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '')
        return rawData == rOpVal;
        break;
    }
  },

  async executeTest({ query, data }) {
    return new Promise((resolve, reject) => {
      let call = Object.keys(query)[0];
      let params = Object.entries(query)[0][1];

      let operator = Object.keys(params)[0];
      let operatorVal = Object.values(params)[0];

      switch (call) {
        case "matches":
          let values = params.values;
          if(params.type == "large"){
            for(let i=0;i<values.length;i++){
              let doesMatch = this.executeOperator({
                operator:"equalsLarge",
                operatorVal:params.data[i],
                data:data,
                value:params.values[i]
              })
              if(doesMatch){
                resolve(true)
              }
            }
          }else{
            for(let i=0;i<values.length;i++){
              var doesMatch = this.executeOperator({
                operator:"equals",
                operatorVal:data,
                data:data,
                value:params.data[i]
              })
              if(doesMatch){
                resolve(true)
              }
            }
          }
          resolve(false)
          break;
        default:
          let isTrue = this.executeOperator({
            operator: operator,
            params: params,
            value: call,
            operatorVal: operatorVal,
            data: data,
          });
          resolve(isTrue);
          break;
      }
    });
  },

  async executeRootTest({ query, data }) {
    return new Promise((resolve, reject) => {
      let call = Object.keys(query)[0];
      let params = Object.entries(query)[0][1];

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
      let call = Object.keys(query)[0];
      let params = Object.values(query)[0];

      switch (call) {
        case "sort":
          this.executeQuery({ query: params.value, path: path }).then(
            (value) => {
              switch (params.order) {
                case "+-":
                  value.sort((a, b) => {
                    return b[params.sortBy] - a[params.sortBy];
                  });
                  break;
                case "-+":
                  value.sort((a, b) => {
                    return a[params.sortBy] - b[params.sortBy];
                  });
                  break;
              }
              resolve(value);
            }
          );
          break;
        case "allInstances":
          jetpack.listAsync(path).then((files) => {
            if (files.length == 0) {
              resolve([]);
            }

            for (let i = 0; i < files.length; i++) {
              let fileName = files[i];
              let rdata = jetpack.read(path + "/" + fileName);
              let data = JSON.parse(rdata);

              this.executeRootTest({
                query: params,
                data: data,
              }).then((fData) => {
                if (fData != "undefined") {
                  fData.extDATA = {
                    id: fileName.split(".")[0]
                  }
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

        default:
          shared.callCustomFilter({
            name: call,
            exists: (method) => {
              method({ params: params, path: path, resolve: resolve });
            },
            notExists: () => {
              console.log("Call not exists");
              reject();
            },
          });
          break;
      }
    });
  },
};
