const fs = require('fs');
const path = require('path');
const dirPath = path.join(__dirname,'/secret-folder');
let filePath;
try {
  fs.readdir(dirPath, {withFileTypes: true}, (error, files) => {
    for(let i in files)
      if(files[i].isFile()){
        if(files[i].name.indexOf('.')!=-1){
          filePath = path.join(dirPath, files[i].name);
          fs.stat(filePath,(err,stats)=>{
            console.log (` ${files[i].name.slice(0,files[i].name.indexOf('.'))} - ${path.extname(path.join(dirPath, files[i].name)).slice(1)} - ${stats.size/1024} Kb`);
          });
        } else{
          filePath = path.join(dirPath, files[i].name);
          fs.stat(filePath,(err,stats)=>{
            console.log (` ${files[i].name.slice(0,files[i].name.indexOf('.')-1)} - ${stats.size/1024} Kb`);
          }); 
        }
      }
  });
} catch (err) {
  console.error(err);
}
