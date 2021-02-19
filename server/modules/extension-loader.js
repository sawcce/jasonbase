const { cwd } = require("fs-jetpack");
const jetpack = require("fs-jetpack");
const jason_module = require("./jason-server");
const auth_module = require("./auth");
const db_module = require("./db");
const query_module = require("./query");

var colors = {
  Reset: "\x1b[0m",
  Bright: "\x1b[1m",
  Dim: "\x1b[2m",
  Underscore: "\x1b[4m",
  Blink: "\x1b[5m",
  Reverse: "\x1b[7m",
  Hidden: "\x1b[8m",

  FgBlack: "\x1b[30m",
  FgRed: "\x1b[31m",
  FgGreen: "\x1b[32m",
  FgYellow: "\x1b[33m",
  FgBlue: "\x1b[34m",
  FgMagenta: "\x1b[35m",
  FgCyan: "\x1b[36m",
  FgWhite: "\x1b[37m",

  BgBlack: "\x1b[40m",
  BgRed: "\x1b[41m",
  BgGreen: "\x1b[42m",
  BgYellow: "\x1b[43m",
  BgBlue: "\x1b[44m",
  BgMagenta: "\x1b[45m",
  BgCyan: "\x1b[46m",
  BgWhite: "\x1b[47m",
};

const extensions_folder = cwd() + "/api/extensions/";

module.exports = {
  loadModules() {
    var folders = jetpack.list(extensions_folder);
    folders.forEach((extensionName) => {
      let rootPath = extensions_folder + extensionName;
      var configPath = `${rootPath}/extension.json`;
      var configExists = jetpack.exists(configPath);

      if (configExists) {
        var config = JSON.parse(jetpack.read(configPath));
        var moduleName = config.name;
        var entryPoint = config.entry;
        var entryPath = `${rootPath}/${entryPoint}`;
        var module = require(entryPath);
        var params = {
          jason: jason_module,
          color: colors,
          auth: auth_module,
          db: db_module,
          query: query_module,
        };
        module(params);
        console.log(
          `-> ${colors.FgYellow}${moduleName} ${colors.FgWhite} loaded !`
        );
      }
    });
  },
};
