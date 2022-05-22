const fs = require('fs');
const path = require('path');

class ProjectBuilder{
    
    constructor(projectDistPath,assetsPath){
        this.projectDistPath=projectDistPath;
        this.assetsPath=assetsPath;
        this.fontsPath=path.join(assetsPath,'fonts');
        this.imgPath=path.join(assetsPath,'img');
        this.svgPath=path.join(assetsPath,'svg');
    }

      __copyFiles(src,dst){
        //*Copy files in dir
         fs.readdir(src, {withFileTypes: true}, (error, files) => {
            try {
                files.forEach((file)=>{
                    if(file.isFile()){
                        fs.copyFile(path.join(src,file.name),path.join(dst,file.name),(error) => (err) => {
                            if (err) throw err;})
                    } else {
                        console.log(path.join(file.name));
                         fs.mkdir(path.join(dst,file.name), { recursive: true }, (err) => {
                            if (err) throw err;
                             this.__copyFiles(path.join(src,file.name),path.join(dst,file.name));
                        })
                    }  
                })
            } catch (error) {
            throw error; 
            }
        })
    }
}



const projectDistPath = path.join(__dirname,'project-dist');
const assetsPath = path.join(__dirname,'assets');



//*MakeDir

fs.mkdir(projectDistPath, { recursive: true }, (err) => {
    if (err) throw err;}) /*/
/*RemoveDir
fs.rm(projectDistPath,{ recursive: true },(err) => {
    if (err) throw err;});
    */

const projectBuilder = new ProjectBuilder(projectDistPath,assetsPath);
projectBuilder.__copyFiles(assetsPath,projectDistPath);


