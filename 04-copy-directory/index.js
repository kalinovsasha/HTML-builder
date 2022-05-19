const fs = require('fs');
const path = require('path');
const filesCopy=path.join(__dirname, 'files-copy');
const filesPath =path.join(__dirname, 'files');

fs.access(filesCopy, fs.F_OK, (err) => {
  if (err) {
    fs.mkdir(filesCopy, { recursive: true }, (err) => {
      if (err) throw err;
      // Create files    
      fs.readdir(filesPath, 'utf8', (err, files) => {
        if (err) throw err;
        files.forEach((file)=>{
          fs.readFile(path.join(filesPath, file), 'utf-8', (err, data) => {
            if(err){
              console.log('err');
            }
            fs.writeFile(path.join(filesCopy, file), data, (err) => {
              if (err) {
                throw err;
              } });
          });
        });
      });
    });
    console.log('files-copy created');
  } else {
    console.log('exist');
    fs.readdir(filesPath, 'utf8', (err, files) => {
      if (err) throw err;
      files.forEach((file)=>{
        fs.readFile(path.join(filesPath, file), 'utf-8', (err, data) => {
          if(err){
            console.log('err');
          }
          fs.writeFile(path.join(filesCopy, file), data, (err) => {
            if (err) {
              throw err;
            } });
        });
      });
    });
  }
});

