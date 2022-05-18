const fs = require('fs');
const path = require('path');
const readline = require('node:readline');
const process = require('process');

const filePath = path.join(__dirname,'file.txt');
const rl = readline.createInterface({ input:process.stdin, output:process.stdout});
const stream = fs.createWriteStream (filePath);
console.log('Hello, print something');

rl.on('SIGINT', () => {
  console.log(`Файл ${filePath} создан!`);
  rl.close();
});
rl.on('line', (line) => {
  if (line === 'exit' || line === 'Exit') {
    console.log(`Файл ${filePath} создан!`);
    rl.close();
  } else {
    stream.write(`${line}\n`);
  }
});





/*//Проверка на существование файла
fs.access(filePath, fs.F_OK, (err) => {
    if (err) {
      console.error("err")
      return
    }
    //file exists
  })
*/
//fs.createReadStream(path.join(__dirname, './file.txt'), 'utf8').pipe(process.stdout);













