// 更新打包后project.config.json项目信息
var fs = require('fs');

// 获取项目初始化小程序配置
var originSetting = fs.readFileSync('project.config.json').toString();

// 获取client小程序配置
var clientSetting = JSON.parse(fs.readFileSync('src/project.config.json').toString());

let { setting, appid, projectname, condition } = JSON.parse(originSetting);
let settingObj = { setting, appid, projectname, condition };
// 更新操作
for(let i in settingObj){
  clientSetting[i] = settingObj[i];
}

// 重新写入client中的project.config.json
fs.writeFile('src/project.config.json',JSON.stringify(clientSetting),(error)=>{
    if(error){
      console.error('配置更新失败,请重试');
    }
})


