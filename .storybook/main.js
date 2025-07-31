/** @type { import('@storybook/react-webpack5').StorybookConfig } */
const config = {
  stories: [
    "../demo/stories/**/*.stories.@(js|jsx|ts|tsx)",
    "../packages/**/stories/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "@storybook/addon-a11y",
    "@storybook/addon-viewport"
  ],
  framework: {
    name: "@storybook/react-webpack5",
    options: {}
  },
  docs: {
    autodocs: "tag"
  },
  webpackFinal: async (config) => {
    // Add CSS modules support
    config.module.rules.push({
      test: /\.scss$/,
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
    });

    return config;
  }
};

module.exports = config; 