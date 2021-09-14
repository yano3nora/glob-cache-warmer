// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require("path");
const nodeExternals = require('webpack-node-externals');

const config = {
  target: 'node',
  // https://github.com/liady/webpack-node-externals
  externalsPresets: { node: true },
  externals: [nodeExternals()],
  entry: "./src/index.ts",
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, "dist"),
  },
  plugins: [
    // Add your plugins here
    // Learn more about plugins from https://webpack.js.org/configuration/plugins/
  ],
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/i,
        loader: "ts-loader",
        exclude: ["/node_modules/"],
      },

      // Add your rules for custom modules here
      // Learn more about loaders from https://webpack.js.org/loaders/
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    alias: {
      '@libs': path.resolve(__dirname, 'src/libs/'),
      '@commands': path.resolve(__dirname, 'src/commands/'),
    }
  },
};

module.exports = (_, argv) => {
  config.mode = argv.mode;

  if (config.mode === "development") {
    config.devtool = 'inline-source-map';
  }

  return config;
};
