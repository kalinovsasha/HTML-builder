const fs = require('fs');
const path = require('path');

class BundleCollector {
  constructor(stylesPath,bundlePath){
    this.bundlePath=bundlePath;
    this.stylesPath=stylesPath;
  }
  collect(){
    const stream = fs.createWriteStream (this.bundlePath);
    fs.readdir(this.stylesPath, {withFileTypes: true}, (error, files) => {
      files.forEach((file)=>{
        if(file.isFile() && path.extname(path.join(this.stylesPath, file.name))==='.css'){
          fs.readFile(path.join(path.join(this.stylesPath, file.name)), 'utf-8', (err, data) => {
            stream.write(data+'\n');
          });
        }         
      });
    });
  }
}

const stylesPath = path.join(__dirname,'styles');
const bundlePath = path.join(__dirname,'project-dist','bundle.css');

let bundleCollector= new BundleCollector(stylesPath,bundlePath);
bundleCollector.collect();


