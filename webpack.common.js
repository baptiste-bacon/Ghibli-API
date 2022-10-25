const path = require("path");
const webpack = require("webpack");

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");

const IS_DEVELOPMENT = process.env.NODE_ENV === "dev";

const dirNode = "node_modules";
const dirPublic = path.resolve(__dirname, "public");
const dirSrc = path.join(__dirname, "src");
const dirApp = path.join(dirSrc, "app");
const dirStyles = path.join(dirSrc, "styles");
const dirImages = path.join(dirSrc, "images");
const dirVideos = path.join(dirSrc, "videos");

module.exports = {
  entry: [path.join(dirApp, "index.js"), path.join(dirStyles, "index.scss")],
  resolve: {
    modules: [dirSrc, dirApp, dirStyles, dirImages, dirVideos, dirNode],
  },
  output: {
    clean: true,
    path: dirPublic,
  },

  plugins: [
    new webpack.DefinePlugin({
      IS_DEVELOPMENT,
    }),
    new MiniCssExtractPlugin(),

    new CopyPlugin({
      patterns: [{ from: dirImages, to: dirPublic }],
    }),
  ],
  module: {
    rules: [
      //JS
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
        },
      },

      //SCSS
      {
        test: /\.scss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          { loader: "css-loader" },
          { loader: "postcss-loader" },
          { loader: "sass-loader" },
        ],
      },

      //Assets
      {
        test: /\.(png|svg|jpg|jpeg|gif|fnt|webp|woff2?|)$/,
        loader: "file-loader",
        options: {
          name(file) {
            return "[hash].[ext]";
          },
        },
      },
      //Shaders
      {
        test: /\.(glsl|frag|vert)$/,
        loader: "raw-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.(glsl|frag|vert)$/,
        loader: "glslify-loader",
        exclude: /node_modules/,
      },
    ],
  },
};
