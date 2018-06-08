# mpvue-qcloud

> mpvue with qcloud (wafer2)

## Build Setup

``` bash
# open your project
cd your_project_base_dir

# install mpvue dependencies
npm install
# or use yarn to install mpvue dependencies
yarn

# install wafer dependencies
cd server && npm i

# or use yarn to install wafer dependencies
cd server && yarn

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

# 写在前面的话
> `mpvue-qcloud`是低度整合了wafer和mpvue的quickstart项目。你可以无需配置直接使用该项目开发小程序。打造的是前后端一站式开发体验,
> 其中前端使用`mpvue`进行开发小程序。使小程序在使用`vue`的基础上拥有绝对的组件化开发能力。
> 后端使用的为`wafer`nodejs快速开发模板。使用腾讯云的免费开发环境

## `wafer`和`mpvue`快速传送门
> `wafer`:[传送门](https://github.com/tencentyun/wafer2-quickstart-nodejs/blob/master/README.md);  注: 配置规则请看下面。因为该项目已经内置了wafer的nodejs快速启动demo

> `mpvue`:[传送门](http://mpvue.com/);   此处也需要部分配置，请观看下方

## `wafer`配置
* 打开`your_project_base_url/project.config.json`和`your_project_base_url/src/project.config.json`修改如下部分
```bash
  # 增加你的appid
  appid:'your appid'

  # 增加你的projectname(默认为mpvue-qcloud)
  projectname:'your projectname'
```

* 打开`your_project_base_url/server/config.js`修改如下部分
```bash
  # 增加appID
  appId:'your appid'

  # 添加数据库密码,初始为您的appid
  mysql : {
    pass : 'your appid'
  }
```

* 当第一次上传腾讯云测试代码之后，会自动分配一个测试环境的地址，修改`your_project_base_url/src/config.js`
```bash
  # 添加分配的测试环境地址
  var host = '分配的地址';
```

> 具体如何初次上传代码请点击[传送门](https://github.com/tencentyun/wafer2-quickstart-nodejs/blob/master/README.md#%E4%B8%89%E5%88%9D%E5%A7%8B%E5%8C%96-demo-%E5%B9%B6%E4%B8%8A%E4%BC%A0),此处第三步开始

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
