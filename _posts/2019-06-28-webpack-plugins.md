---
layout: post
title: "webpack插件"
subtitle: ""
author: "ZJT"
header-style: text
tags:
  - webpack
---

### 编译器（Compiler）和编译（Compilation）

- compiler 对象代表了 Webpack 完整的可配置的环境。该对象在 Webpack 启动的时候会被创建，同时该对象也会被传入一些可控的配置，如 Options、Loaders、Plugins。当插件被实例化的时候，会收到一个 Compiler 对象，通过这个对象可以访问 Webpack 的内部环境。

- compilation 对象在每次文件变化的时候都会被创建，因此会重新产生新的打包资源。该对象表示本次打包的模块、编译的资源、文件改变和监听的依赖文件的状态。而且该对象也会提供很多的回调点，我们的插件可以使用它来完成特定的功能，而提供的钩子函数在前面的章节已经讲过了，此处不再赘述

### 基本插件架构

插件都是被实例化的带有 apply 原型方法的对象。这个 apply 方法在安装插件时将被 webpack 编译器调用一次。apply 方法提供了一个对应的编译器对象的引用，从而可以访问到相关的编译器回调。一个简单的插件结构如下：

```
function compilerTest (options) {
}
compilerTest.prototype.apply = function (compiler) {
    compiler.plugin('compilation', function (compilation) {
              compilation.plugin("optimize", function() {
                      console.log("这里被触发了哦");
                });
     })
}
module.exports = compilerTest
```

### 在 webpack 中使用插件

```
var compilerFeTest = require('compiler-fe-test');
plugins: [
    new compilerFeTest({tip:'这里是插件接收的参数哦'})
]
```

### 异步编译插件

```
function compilerTest (options) {}
compilerTest.prototype.apply = function (compiler) {
    compiler.plugin('done', function () {
           console.log('我被调用了哦～～')
     })
     compiler.plugin("emit", function(compilation, callback) {
            // 做一些异步处理……
           console.log('进来了')
           setTimeout(function() {
                 console.log("我是异步的哦");
                 callback();
               }, 2000);
           console.log('出去了')
         });
}
module.exports = compilerTest
```

这里的 callback ()怎么理解？当我们运行时候，打印的顺序：进来了-出去了-我是异步的哦-我被调用了哦。

如果我们注释掉 callback(); 打印的顺序：进来了-出去了-我是异步的哦 ，我们发现 “我被调用了哦”这句日志没有被打印出来，所以：emit 提供的 callback 是用来告诉编译进程，异步处理函数结束了，触发 done 钩子。

### 整个插件过程分析

```
 /**
  * webpack插件开发采用'动态原型模式'
  * 插件开发，最重要的两个对象：compiler、compilation
  * @param options
  * @constructor
  */
 function MyPlugin(options) { // 根据 options 配置你的插件

 }
 // 我们可以在原型上添加一些方法
 MyPlugin.prototype.someFunc = function() {/*something*/}

// apply方法是必须要有的，因为当我们使用一个插件时（new somePlugins({})），webpack会去寻找插件的apply方法并执行
MyPlugin.prototype.apply = function(compiler) {
  // compiler是什么？compiler是webpack的'编译器'引用


  // compiler.plugin('***')和compilation.plugin('***')代表什么？
  // document.addEventListener熟悉吧？其实是类似的
  // compiler.plugin('***')就相当于给compiler设置了事件监听
  // 所以compiler.plugin('compile')就代表：当编译器监听到compile事件时，我们应该做些什么

  // compile（'编译器'对'开始编译'这个事件的监听）
  compiler.plugin("compile", function(params) {
    console.log("The compiler is starting to compile...");
  });

  // compilation（'编译器'对'编译ing'这个事件的监听）
  compiler.plugin("compilation", function(compilation) {
    console.log("The compiler is starting a new compilation...");
    // 在compilation事件监听中，我们可以访问compilation引用，它是一个代表编译过程的对象引用
    // 我们一定要区分compiler和compilation，一个代表编译器实体，另一个代表编译过程
    // optimize('编译过程'对'优化文件'这个事件的监听)
    compilation.plugin("optimize", function() {
      console.log("The compilation is starting to optimize files...");
    });
  });

  // emit（'编译器'对'生成最终资源'这个事件的监听）
  compiler.plugin("emit", function(compilation, callback) {
    console.log("The compilation is going to emit files...");

    // compilation.chunks是块的集合（构建后将要输出的文件，即编译之后得到的结果）
    compilation.chunks.forEach(function(chunk) {
      // chunk.modules是模块的集合（构建时webpack梳理出的依赖，即import、require的module）
      // 形象一点说：chunk.modules是原材料，下面的chunk.files才是最终的成品
      chunk.modules.forEach(function(module) {
        // module.fileDependencies就是具体的文件，最真实的资源【举例，在css中@import("reset.css")，这里的reset.css就是fileDependencie】
        module.fileDependencies.forEach(function(filepath) {
          // 到这一步，就可以操作源文件了
        });
      });

      // 最终生成的文件的集合
      chunk.files.forEach(function(filename) {
        // source()可以得到每个文件的源码
        var source = compilation.assets[filename].source();
      });
    });

    // callback在最后必须调用
    callback();
  });
};

// 以上compiler和compilation的事件监听只是一小部分，详细API可见该链接http://www.css88.com/doc/webpack2/api/plugins/

module.exports = MyPlugin;
```

### 哪些常用的插件

1. DefinePlugin

DefinePlugin 允许创建一个在编译时可以配置的全局常量。这可能会对开发模式和发布模式的构建允许不同的行为非常有用。如果在开发构建中，而不在发布构建中执行日志记录，则可以使用全局常量来决定是否记录日志。这就是 DefinePlugin 的用处，设置它，就可以忘记开发和发布构建的规则。

每个传进 DefinePlugin 的键值都是一个标志符或者多个用 . 连接起来的标志符。

- 如果 value 是一个字符串，它将会被当做 code 片段
- 如果 value 不是字符串，它将会被 stringify(包括函数)
- 如果 value 是一个对象，则所有 key 的定义方式相同。
- 如果 key 有 typeof 前缀，它只是对 typeof 调用定义的。

这些值将内联到代码中，压缩减少冗余。

```
new webpack.DefinePlugin({
    PRODUCTION: JSON.stringify(true),
    VERSION: JSON.stringify('5fa3b9'),
    BROWSER_SUPPORTS_HTML5: true,
    TWO: '1+1',
    'typeof window': JSON.stringify('object'),
    'process.env': {
         NODE_ENV: JSON.stringify(process.env.NODE_ENV)
     }
});
```

plugin 不是直接的文本值替换，它的值在字符串内部必须包括实际引用。典型的情况是用双引号或者 JSON.stringify()进行引用，'"production"',JSON.stringify('production')。

**重点:在 vue-cli 创建的项目中，凡是 src 下的文件，都可以访问到 VERSION 这个变量，例如 main.js，App.vue 等等**

我们现在看一下上面的几种类型的 key 值，在代码中的输出。

```
console.log(PRODUCTION, VERSION, BROWSER_SUPPORTS_HTML5, TWO, typeof window, process.env);

PRODUCTION: true,
VERSION: "5fa3b9",
BROWSER_SUPPORTS_HTML5: true,
TWO: 2,
typeof window: "object",
process.env: {NODE_ENV: "development"},
```

在代码中，我们一般会有以下几种用途：

- 根据 process.env.NODE_ENV 区分环境
- 引入配置文件
- 根据 NODE_ENV 引入配置文件（这个很重要，后面会讲到）

下面我将以一个实例来介绍如何正确使用 webpack.DefinePlugin。

**/config/api.js**

```
const NODE_ENV = process.env.NODE_ENV;
const config = {
     production: {
        FOO_API: 'production.foo.api.com',
        BAR_API: 'production.bar.api.com',
        BAZ_API: 'production.baz.api.com',
     },
     development: {
        FOO_API: 'development.foo.api.com',
        BAR_API: 'development.bar.api.com',
        BAZ_API: 'development.baz.api.com',
     },
     test: {
        FOO_API: 'test.foo.api.com',
        BAR_API: 'test.bar.api.com',
        BAZ_API: 'test.baz.api.com',
     }
}
module.exports = config[NODE_ENV];
```

**webpack.dev.conf.js/webpack.prod.conf.js/webpack.test.conf.js**

```
const apiConfig = require('./config/api');
const webpackConfig = {
    plugins: [
        new webpack.DefinePlugin({
            API_CONFIG: JSON.stringify(apiConfig);
        })
    ]
}
```

**custom.component.vue**

```
<template>
...
</template>
<script>
// 这里也可以访问到API_CONFIG
export default {
    // 这里无论是data函数，methods对象，computed对象，watch对象，都可以访问到API_CONFIG;
   data() {
       return {
           fooApi: API_CONFIG.FOO_API,
           user:{
               id: '',
               name: '',
           },
           hash: '',
        }
    },
    computed: {
        userAvator() {
            return `${API_CONFIG.BAR_API}?id=${user.id}&name=${user.name}`
        }
    },
    methods: {
        uploadImage() {
            api.uploadImage({user: `${API_CONFIG.BAZ}\${hash}`})
                 .then(()=>{})
                 .catch(()=>{})
        }
    }
}
</script>
```

2. clean-webpack-plugin

在每次生成 dist 目录前，先删除本地的 dist 文件（每次自动删除太麻烦）

使用:

```
plugins:[
        new CleanWebpackPlugin(['dist']), //传入数组,指定要删除的目录
        new HtmlWebpackPlugin({
            chunks:['index'],
            filename:'index.html',
            minify:{
                collapseWhitespace:true //折叠空白区域 也就是压缩代码
            },
            hash:true,
            title:'I love China',
            template: './src/index.html' //模板地址
        })
    ]
```
