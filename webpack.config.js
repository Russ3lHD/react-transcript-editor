// based on https://itnext.io/how-to-package-your-react-component-for-distribution-via-npm-d32d4bf71b4f
// and http://jasonwatmore.com/post/2018/04/14/react-npm-how-to-publish-a-react-component-to-npm
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');

module.exports = {
  mode: 'production',
  entry: {
    index: './packages/index.js',
    TranscriptEditor: './packages/components/transcript-editor/index.js',
    TimedTextEditor: './packages/components/timed-text-editor/index.js',
    MediaPlayer: './packages/components/media-player/index.js',
    ProgressBar: './packages/components/media-player/src/ProgressBar.js',
    PlaybackRate: './packages/components/media-player/src/PlaybackRate.js',
    PlayerControls: './packages/components/media-player/src/PlayerControls/index.js',
    Select: './packages/components/media-player/src/Select.js',
    VideoPlayer: './packages/components/video-player/index.js',
    Settings: './packages/components/settings/index.js',
    KeyboardShortcuts: './packages/components/keyboard-shortcuts/index.js',
    timecodeConverter: './packages/util/timecode-converter/index.js',
    exportAdapter: './packages/export-adapters/index.js',
    sttJsonAdapter: './packages/stt-adapters/index.js',
    groupWordsInParagraphsBySpeakersDPE: './packages/stt-adapters/digital-paper-edit/group-words-by-speakers.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    library: {
      type: 'umd',
      name: '[name]'
    },
    globalObject: 'this'
  },
  externals: {
    react: {
      commonjs: 'react',
      commonjs2: 'react',
      amd: 'React',
      root: 'React'
    },
    'react-dom': {
      commonjs: 'react-dom',
      commonjs2: 'react-dom',
      amd: 'ReactDOM',
      root: 'ReactDOM'
    }
  },
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
                  browsers: ['>0.2%', 'not dead', 'not ie <= 11', 'not op_mini all']
                }
              }],
              '@babel/preset-react'
            ],
            plugins: [
              '@babel/plugin-transform-object-rest-spread',
              '@babel/plugin-transform-class-properties',
              '@babel/plugin-transform-optional-chaining'
            ]
          }
        }
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[name]__[local]___[hash:base64:5]',
                namedExport: false,
                exportLocalsConvention: 'asIs'
              },
              importLoaders: 1,
              esModule: false
            }
          },
          'sass-loader'
        ]
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[name]__[local]___[hash:base64:5]',
                namedExport: false,
                exportLocalsConvention: 'asIs'
              },
              importLoaders: 1,
              esModule: false
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css'
    }),
    // Provide polyfills for Node.js globals
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      process: 'process/browser.js'
    })
  ],
  resolve: {
    extensions: ['.js', '.jsx'],
    fallback: {
      // Polyfills for Node.js core modules (required for webpack 5)
      // These are needed by the difflib package
      assert: require.resolve('assert/'),
      buffer: require.resolve('buffer/'),
      process: require.resolve('process/browser.js'),
      // Add other polyfills as needed
      util: false,
      stream: false,
      path: false,
      fs: false
    }
  }
};
