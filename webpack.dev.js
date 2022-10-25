const path = require("path");

const { merge } = require("webpack-merge");
const common = require("./webpack.common");

module.exports = merge(common, {
  mode: "development",
  devtool: "inline-source-map",
  devServer: {
    devMiddleware: {
      writeToDisk: true,
    },
  },
  output: {
    path: path.resolve(__dirname, "public"),
  },
});
