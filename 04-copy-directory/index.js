const fs = require('fs');
const path = require('path');
const filesCopy=path.join(__dirname, 'files-copy');
const filesPath =path.join(__dirname, 'files');

function copyFiles(src,dst){
  //*Copy files in dir
  fs.readdir(src, {withFileTypes: true}, (error, files) => {
    files.forEach((file)=>{
      if(file.isFile()){
        fs.copyFile(path.join(src,file.name),path.join(dst,file.name),(err) => {
          if (err) throw err;});
      } else {
        fs.mkdir(path.join(dst,file.name), { recursive: true }, (err) => {
          if (err) throw err;
          this.__copyFiles(path.join(src,file.name),path.join(dst,file.name));
        });
      }  
    });
  }   
  );
}

fs.promises.rm(filesCopy,{ recursive: true, force: true }).then(()=>{
  fs.mkdir(filesCopy, { recursive: true }, (err) => {
    if (err) throw err;
    copyFiles(filesPath,filesCopy);
  });
});










/*
fs.access(filesCopy, fs.F_OK, (err) => {
  if (err) {
    fs.mkdir(filesCopy, { recursive: true }, (err) => {
      if (err) throw err;
      // Create files    
      fs.readdir(filesPath, 'utf8', (err, files) => {
        if (err) throw err;
        files.forEach((file)=>{
          fs.stat(path.join(filesPath, file),(err, data) => {
            if(data.isFile()){
              fs.readFile(path.join(filesPath, file), 'utf-8', (err, data) => {
                if(err){
                  console.log('err');
                }
                fs.writeFile(path.join(filesCopy, file), data, (err) => {
                  if (err) {
                    throw err;
                  } });
              });
            }
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
        fs.stat(path.join(filesPath, file),(err, data) => { //isFile
          if(data.isFile()){
            fs.readFile(path.join(filesPath, file), 'utf-8', (err, data) => {
              if(err){
                console.log('err');
              }
              fs.writeFile(path.join(filesCopy, file), data, (err) => {
                if (err) {
                  throw err;
                } });
            });
          }
        }); 
      });
    });
  }
});

*/