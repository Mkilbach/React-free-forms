require("@babel/polyfill/noConflict");
const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  mode: "production",
  entry: {
    main: ["@babel/polyfill/noConflict", "./src/js/index.js"]
  },
  output: {
    filename: "[name].min.js",
    path: path.resolve(__dirname, "public"),
    library: 'react-free-forms',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  externals: {
    'react': 'react',
    'react-dom': 'reactDOM',
  },
  optimization: {
    minimizer: [
      new OptimizeCssAssetsPlugin(),
      new TerserPlugin()
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({ filename: "[name].css" }),
    new CleanWebpackPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "sass-loader"
        ]
      },
      {
        test: /\.(svg|png|jpg|gif)$/,
        use: {
          loader: "file-loader",
          options: {
            name: "[name].[hash].[ext]",
            outputPath: "imgs"
          }
        }
      },
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
        }
      }
    ]
  }
};