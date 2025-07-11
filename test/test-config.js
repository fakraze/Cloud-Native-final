// Test environment configuration
const { environments, currentEnv, config } = require('./cypress/support/environments');

console.log('Available environments:', Object.keys(environments));
console.log('Current environment:', currentEnv);
console.log('Configuration:', JSON.stringify(config, null, 2));

// Test with different environment variables
process.env.CYPRESS_ENV = 'prod';
delete require.cache[require.resolve('./cypress/support/environments')];
const prodConfig = require('./cypress/support/environments');
console.log('\nProduction configuration:', JSON.stringify(prodConfig.config, null, 2));

process.env.CYPRESS_ENV = 'dev';
delete require.cache[require.resolve('./cypress/support/environments')];
const devConfig = require('./cypress/support/environments');
console.log('\nDevelopment configuration:', JSON.stringify(devConfig.config, null, 2));
