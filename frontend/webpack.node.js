/**
 * Node.js webpack configuration for Excel Analytics frontend
 * Converted from tsconfig.node.json
 */

const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  // Specify that we're building for Node.js
  target: 'node',
  
  // Node.js specific settings
  node: {
    __dirname: false,
    __filename: false,
  },
  
  // Entry point
  entry: './src/main.js',
  
  // Output configuration
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'server.js',
    libraryTarget: 'commonjs2'
  },
  
  // Externalize node_modules
  externals: [nodeExternals()],
  
  // Module rules
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', {
                targets: {
                  node: 'current',
                },
              }],
              '@babel/preset-react'
            ]
          }
        }
      }
    ]
  },
  
  // Resolve extensions and aliases
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  
  // Development or production mode
  mode: process.env.NODE_ENV || 'development',
  
  // Source maps
  devtool: process.env.NODE_ENV === 'production' ? 'source-map' : 'eval-source-map',
};