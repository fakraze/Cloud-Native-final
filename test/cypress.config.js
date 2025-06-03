const { defineConfig } = require('cypress')

const environment = process.env.CYPRESS_ENV || 'dev';
const environments = {
  dev: 'http://13.218.27.133/dev/frontend',
  prod: 'http://13.218.27.133'
};

module.exports = defineConfig({
  e2e: {
    baseUrl: environments[environment],
    supportFile: false
  }
})
