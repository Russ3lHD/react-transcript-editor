const config = {
  stories: [
    '../demo/stories/**/*.stories.@(js|jsx|ts|tsx)',
    '../packages/**/stories/**/*.stories.@(js|jsx|ts|tsx)'
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-a11y',
    '@storybook/addon-viewport'
  ],
  framework: {
    name: '@storybook/react-webpack5',
    options: {}
  },
  docs: {
    autodocs: 'tag'
  },
  webpackFinal: async (config) => {
    // Add Node.js polyfills for webpack 5
    // Required for difflib package (used in transcript timestamp alignment)
    config.resolve.fallback = {
      ...config.resolve.fallback,
      assert: require.resolve('assert/'),
      buffer: require.resolve('buffer/'),
      process: require.resolve('process/browser.js'),
      util: false,
      stream: false,
      path: false,
      fs: false
    };

    // Provide polyfills for Node.js globals
    const webpack = require('webpack');
    config.plugins.push(
      new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
        process: 'process/browser.js'
      })
    );

    // Fix react-docgen-loader issues by excluding it from JSX/TSX files
    config.module.rules = config.module.rules.map(rule => {
      if (rule.use && Array.isArray(rule.use)) {
        rule.use = rule.use.filter(loader => {
          if (typeof loader === 'string' && loader.includes('react-docgen-loader')) {
            return false;
          }
          if (typeof loader === 'object' && loader.loader && loader.loader.includes('react-docgen-loader')) {
            return false;
          }
          return true;
        });
      }
      return rule;
    });

    // Add proper CSS modules support for SCSS files
    const cssRule = {
      test: /\.module\.scss$/,
      use: [
        'style-loader',
        {
          loader: 'css-loader',
          options: {
            modules: {
              localIdentName: '[name]__[local]___[hash:base64:5]'
            },
            importLoaders: 1
          }
        },
        'sass-loader'
      ]
    };

    // Add regular SCSS support
    const scssRule = {
      test: /\.scss$/,
      exclude: /\.module\.scss$/,
      use: [
        'style-loader',
        {
          loader: 'css-loader',
          options: {
            importLoaders: 1
          }
        },
        'sass-loader'
      ]
    };

    // Remove existing SCSS rules and add our new ones
    config.module.rules = config.module.rules.filter(rule =>
      !(rule.test && rule.test.test && (rule.test.test('file.scss') || rule.test.test('file.module.scss')))
    );
    
    config.module.rules.push(cssRule, scssRule);

    // Ensure proper JSX/TSX handling for Storybook 8
    config.module.rules.push({
      test: /\.(js|jsx|ts|tsx)$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'],
          plugins: []
        }
      }
    });

    return config;
  }
};

module.exports = config;
