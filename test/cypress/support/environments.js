// Environment configurations for Cypress testing
const environments = {
  dev: {
    baseUrl: 'http://13.218.27.133/dev/frontend',
    name: 'Development',
    cartSelector: 'a[href="/dev/frontend/cart"]',
    urlPrefix: '/dev/frontend'
  },
  prod: {
    baseUrl: 'http://13.218.27.133',
    name: 'Production', 
    cartSelector: 'a[href="/cart"]',
    urlPrefix: ''
  }
};

module.exports = {
  environments
};
