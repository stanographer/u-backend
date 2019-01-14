'use strict';
const replace = require('replace-in-file');

try {
  console.log('Adding skipWaiting: true to react-script webpack-config.prod.js');
  replace.sync({
    files: 'node_modules/react-scripts/config/webpack.config.prod.js',
    from: /clientsClaim: true,$/gm,
    to: (match) => {
      return match + ' skipWaiting: true,';
    }
  });
} catch (e) {
  console.log('Something went wrong when trying to add skipWaiting: true to react-script webpack-config.prod.js', e);
  process.exit();
}
