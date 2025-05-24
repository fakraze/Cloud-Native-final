const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://frontend-service.devops-demo.svc.cluster.local',
    specPattern: 'cypress/e2e/**/*.cy.js',
    supportFile: false
  }
})
