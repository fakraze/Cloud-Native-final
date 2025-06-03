const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    supportFile: './cypress/support/e2e.js',
    setupNodeEvents(on, config) {
      // Get environment from Cypress env or default to dev
      const env = config.env.CYPRESS_ENV || 'dev';
      
      // Import environments configuration
      const { environments } = require('./cypress/support/environments');
      const envConfig = environments[env] || environments.dev;
      
      // Update the Cypress config with the correct environment values
      config.baseUrl = envConfig.baseUrl;
      config.env.environment = envConfig.name;
      config.env.urlPrefix = envConfig.urlPrefix;
      config.env.cartSelector = envConfig.cartSelector;
      
      console.log(`Cypress running in ${envConfig.name} environment`);
      console.log(`Base URL: ${config.baseUrl}`);
      console.log(`URL Prefix: ${config.env.urlPrefix}`);
      
      return config;
    }
  }
})
