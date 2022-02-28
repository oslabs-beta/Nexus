const path = require('path');

module.exports = {
  entry: path.resolve(__dirname, './media/renderToDom.js'),
  mode: 'production',
  target: 'node',
  externals: {
    // vscode: 'commonjs vscode',
    path: "require('path')",
    fs: "require('fs')",
  },
  module: {
    rules: [
      // {
      //   test: /\.tsx?$/,
      //   use: {
      //     loader: 'ts-loader',
      //     options: {
      //       configFile: 'tsconfig.views.json',
      //     },
      //   },
      //   exclude: /node_modules/,
      // },
      {
        test: /\.jsx?$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react'],
          },
        },
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'sidebar.js',
    path: path.resolve(__dirname, './dist'),
  },
};
