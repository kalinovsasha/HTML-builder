const fs = require('fs');
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
  __generateHtml(){
    //Генератор html
    let templateDataArr=[];
    let  templateNamesArr=[];

    fs.readdir((path.join(__dirname, 'components')), {withFileTypes: true}, (error, files) => {
      files.forEach((file)=>{
        templateNamesArr.push(`{{${file.name.slice(0,file.name.indexOf('.'))}}}`);
        templateDataArr.push(
          new Promise(function(resolve) {
            const stream = fs.createReadStream(path.join(__dirname, 'components',file.name), 'utf8');
            let data = '';
            stream.on('data', chunk => data += chunk);
            stream.on('error', err => process.stdout.write(`\nError ${err.message}`));
            stream.on('end', () => 
            {
              resolve(data);
            }
            );
          })
        );
      });
      //console.log(templateNamesArr);
      Promise.all(templateDataArr).then((template)=>{
        const stream = fs.createReadStream(path.join(__dirname, './template.html'), 'utf8');
        const stream2 = fs.createWriteStream(path.join(projectDistPath, './index.html'), 'utf8');
        let data = '';
        stream.on('data', chunk => data += chunk);
        stream.on('error', err => process.stdout.write(`\nError ${err.message}`));
        stream.on('end', () => 
        {
          for(let i=0;i<templateNamesArr.length;i+=1){
            data=data.replace(new RegExp( templateNamesArr[i],'g'), template[i]);
            if(i===templateNamesArr.length-1){
              stream2.write(data);
            }
          }
        }
        );
      });
    });
  }
  make(){
    this.__copyFiles(this.assetsPath,this.distAssetsPath);
    this.__collectStyles(this.stylesPath,this.projectDistPath);
    this.__generateHtml();
  }
}


const stylesPath=path.join(__dirname,'styles');
const assetsPath = path.join(__dirname,'assets');
const projectDistPath = path.join(__dirname,'project-dist');

fs.promises.rm(projectDistPath,{ recursive: true, force: true }).then(()=>{
  const projectBuilder = new ProjectBuilder(projectDistPath,assetsPath,stylesPath);
  projectBuilder.make();
});













/*//Old solutions

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


Promise.all([header,articles,footer]).then((template)=>{
  const stream = fs.createReadStream(path.join(__dirname, './template.html'), 'utf8');
  const stream2 = fs.createWriteStream(path.join(projectDistPath, './index.html'), 'utf8');
  const header = '{{header}}';
  const footer = '{{footer}}';
  const articles = '{{articles}}';
  let arr=[header,articles,footer];
  let data = '';
  stream.on('data', chunk => data += chunk);
  stream.on('error', err => process.stdout.write(`\nError ${err.message}`));
  stream.on('end', () => 
  {
    for(let i=0;i<arr.length;i+=1){
      data=data.replace(new RegExp( arr[i],'g'), template[i]);
      if(i===arr.length-1){
        stream2.write(data);
      }
    }
  }
  );
});


*/

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