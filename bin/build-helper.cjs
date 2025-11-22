// helper to ensure lib is present before publishing; noop for consumers
const fs = require('fs');
const path = require('path');
const lib = path.join(__dirname, '..', 'lib', 'check-readonly.cjs');
if (!fs.existsSync(lib)) {
  console.warn('lib/check-readonly.cjs missing. Build your package before publishing.');
}
