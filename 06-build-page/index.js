const pr = require('process');
const fs = require('fs');
const fsPr= require('fs/promises');
const path = require('path');

class ProjectBuilder{
    
  constructor(projectDistPath,assetsPath,stylesPath){
    fs.mkdir(path.join(projectDistPath), { recursive: true }, (err) => {
      if (err) throw err;
      fs.mkdir(path.join(projectDistPath,'assets'), { recursive: true }, (err) => {
        if (err) throw err;});
    });
    this.projectDistPath=projectDistPath;
    this.stylesPath=stylesPath;
    this.assetsPath=assetsPath;
    this.distAssetsPath = path.join(projectDistPath,'assets');
  }

  __copyFiles(src,dst){
    //*Copy files in dir
    fs.readdir(src, {withFileTypes: true}, (error, files) => {
      try {
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
      } catch (error) {
        throw error; 
      }
    });
  }
  __collectStyles(src,dst){
    const stream = fs.createWriteStream (path.join(dst,'style.css'));
    fs.readdir(src, {withFileTypes: true}, (error, files) => {
      files.forEach((file)=>{
        if(file.isFile() && path.extname(path.join(src, file.name))==='.css'){
          fs.readFile(path.join(path.join(src, file.name)), 'utf-8', (err, data) => {
            stream.write(data+'\n');
          });
        }         
      });
    });
  }

  make(){
    this.__copyFiles(this.assetsPath,this.distAssetsPath);
    this.__collectStyles(this.stylesPath,this.projectDistPath);
  }
}


const stylesPath=path.join(__dirname,'styles');
const assetsPath = path.join(__dirname,'assets');
const projectDistPath = path.join(__dirname,'project-dist');
const distAssetsPath = path.join(projectDistPath,'assets');
const distHtml =path.join(projectDistPath,'index.html');

const projectBuilder = new ProjectBuilder(projectDistPath,assetsPath,stylesPath);
projectBuilder.make();

/// Начало костылей, если успею, то переделаю
let articles = new Promise(function(resolve, reject) {
  const stream = fs.createReadStream(path.join(__dirname, 'components','./articles.html'), 'utf8');
  let data = '';
  stream.on('data', chunk => data += chunk);
  stream.on('error', err => process.stdout.write(`\nError ${err.message}`));
  stream.on('end', () => 
  {
    resolve(data);
  }
  );
});
let header = new Promise(function(resolve, reject) {
  const stream = fs.createReadStream(path.join(__dirname, 'components','./header.html'), 'utf8');
  let data = '';
  stream.on('data', chunk => data += chunk);
  stream.on('error', err => process.stdout.write(`\nError ${err.message}`));
  stream.on('end', () => 
  {
    resolve(data);
  }
  );
});
let footer = new Promise(function(resolve, reject) {
  const stream = fs.createReadStream(path.join(__dirname, 'components','./footer.html'), 'utf8');
  let data = '';
  stream.on('data', chunk => data += chunk);
  stream.on('error', err => process.stdout.write(`\nError ${err.message}`));
  stream.on('end', () => 
  {
    resolve(data);
  }
  );
});

///Пока на костылях
Promise.all([header,articles,footer]).then((template)=>{
  const stream = fs.createReadStream(path.join(__dirname, './template.html'), 'utf8');
  const stream2 = fs.createWriteStream(path.join(projectDistPath, './index.html'), 'utf8');
  const header = '{{header}}';
  const footer = '{{footer}}';
  const articles = '{{articles}}';
  let data = '';
  stream.on('data', chunk => data += chunk);
  stream.on('error', err => process.stdout.write(`\nError ${err.message}`));
  stream.on('end', () => 
  {
    stream2.write(
      data.slice(0,data.indexOf(header))+
            template[0]+
            data.slice(data.indexOf(header)+header.length,data.indexOf(articles))+
            template[1]+
            data.slice(data.indexOf(articles)+articles.length,data.indexOf(footer))+
            template[2]+
            data.slice(data.indexOf(footer)+footer.length)
    );
  }
  );
});










/*
 let template = new Promise(function(resolve, reject) {
    const stream = fs.createReadStream(path.join(__dirname, './template.html'), 'utf8');
    const header = '{{header}}';
    const footer = '{{footer}}';
    const articles = '{{articles}}';
    let data = '';
    stream.on('data', chunk => data += chunk);
    stream.on('error', err => process.stdout.write(`\nError ${err.message}`));
    stream.on('end', () => 
    {
        //data=data.split("{{header}}");
        //resolve(data.indexOf('{{header}}'))
        resolve(
            data.slice(0,data.indexOf(header))+
            'header'+
            data.slice(data.indexOf(header)+header.length,data.indexOf(articles))+
            'article'+
            data.slice(data.indexOf(articles)+articles.length,data.indexOf(footer))+
            "footer"+
            data.slice(data.indexOf(footer)+footer.length)
                );
    }
    );
  });
*/

/*RemoveDir
fs.rm(projectDistPath,{ recursive: true, force: true },(err) => {
    if (err) throw err;});
    */
//Создание сборки
//const projectBuilder = new ProjectBuilder(projectDistPath,assetsPath,stylesPath);
//projectBuilder.make();

/*/Кусок с удалением
fsPr.rm(projectDistPath,{ recursive: true, force: true }).then(()=>{
    const projectBuilder = new ProjectBuilder(projectDistPath,assetsPath,stylesPath);
    projectBuilder.make();
}) */