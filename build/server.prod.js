// 遍历wafer中的文件夹进行输出
const fs = require('fs');
const path = require('path');
let filesArray = [];
var dirFiles = fs.readdirSync(path.resolve(__dirname,'../server'));
for(let i = 0 ;i<dirFiles.length; i++){
  let filename = dirFiles[i];  
  let _files = fs.statSync(path.resolve(__dirname,'../server/'+filename));
  // console.log(_files);
  if(_files.isDirectory() && filename != 'node_modules'){  
    // console.log(filename)
    let _set = {
                  from :  path.resolve(__dirname, '../server/'+filename+'/*'),
                  to : path.resolve(__dirname, '../dist')
                }
    filesArray.push(_set);
    // console.log(filesArray)  
  }        
}
module.exports = { filesArray };
