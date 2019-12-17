const fs = require('fs');
const validate = require('./lib');

const spec = fs.readFileSync('./test-spec.yaml', 'utf8');

validate(spec)