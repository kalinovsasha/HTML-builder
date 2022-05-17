const fs = require('fs');
const path = require('path');


const stream = fs.createReadStream(path.join(__dirname, './text.txt'), 'utf8');
let data = '';

stream.on('data', chunk => data += chunk);
stream.on('error', err => process.stdout.write(`\nError ${err.message}`));
stream.on('end', () => console.log(`\n${data}`));




//fs.createReadStream(path.join(__dirname, './text.txt'), 'utf8').pipe(process.stdout);
