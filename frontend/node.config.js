/**
 * Node.js configuration for the Excel Analytics frontend
 * Converted from tsconfig.node.json
 */

module.exports = {
  // Target environment
  target: 'node',
  
  // Module system
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
            ],
            plugins: [
              '@babel/plugin-transform-runtime',
              '@babel/plugin-proposal-class-properties'
            ]
          }
        }
      }
    ]
  },
  
  // Resolve extensions
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    alias: {
      '@': '/src'
    }
  },
  
  // Optimization
  optimization: {
    minimize: process.env.NODE_ENV === 'production',
    nodeEnv: process.env.NODE_ENV || 'development'
  },
  
  // Development settings
  devServer: {
    port: process.env.PORT || 3000,
    hot: true,
    historyApiFallback: true
  },
  
  // Source maps
  devtool: process.env.NODE_ENV === 'production' ? 'source-map' : 'eval-source-map',
  
  // Include files
  include: ['vite.config.js']
};