---
layout: post
title: "webpack打包优化之externals"
subtitle: ""
author: "ZJT"
header-style: text
tags:
  - webpack
---

### 背景

使用 vue-cli 创建项目，使用 webpack 打包。其中，有一个 webpack 优化 webpack.optimize.CommonsChunkPlugin，它会将 node_modules 中的必需模块提取到 vendor 文件中，项目开发中，增加第三方模块，比如 element-ui、vue-echarts 等，vendor 的包都会增大。这个时候，就需要考虑减轻 vendor 包的大小，增加构建速度。我们可以使用 webpack 的外部扩展(externals)功能。

### externals 定义

externals 配置选项，将指定的内容排除在构建的 vendor 中，但是，指定的内容需要出现在用户环境中。

### 用法

防止将某些 import 的包打包到 bundle 中，而是在运行时(runtime)再去外部获取这些扩展依赖(external dependencies)
可以通过多种编写方式实现：string,array,object,function,regex。

```
module.exports = {
  // ...
  externals: [ // array形式
    { // object形式
      './a', 'a', // string形式
      jquery: 'jQuery',
      vue: 'Vue'，
    },
    function(context, request, callback) { // function形式
      if(request.substr(0, 1) !== '.') callback(null, 'commonjs ' + request)
      callback()
    },
    /^[a-z\-0-9]+$/, // regex形式
  ]
}
```

除了 function 形式，必须在 array 形式中，其他形式，都可以提升，直接作为 externals 属性使用。比如 string 形式：

```
externals: {
    './a': 'a',
    jquery: 'jQuery'
}
```

### 实际应用

需要做两步操作：第一步修改 webpack.base.conf.js 文件，第二步，将外部扩展的内容通过其他方式加载到 window 环境，这里，我们通过`<script>标签,并使用cdn来完成。`

1. 配置的文件：webpack.base.conf.js

```
externals: {
  vue : 'Vue',
  "echarts": 'echarts',
  "element-ui": 'ELEMENT'
}
```

2. 在模板文件 index.html 中，添加`<script>标签`

```
<script src="https://unpkg.com/vue@2.5.17/dist/vue.min.js"></script>
<script src="https://unpkg.com/element-ui@2.4.11/lib/index.js"></script>
```

3. 主要作用是缩短打包时间，由于 externals 属性，是将依赖排除，本该将 node_modules 中依赖包打入到 vendor bundle 中，变成外部扩展。

### 需要注意

- script 的先后顺序
- cdn 的地址路径是否正确
- 浏览器的 window 属性值，是否和你的 externals 属性的 value 相对应。可以在 console 控制台输出看看。
- externals 的打包支持什么类型的，就和 output.libraryTarget 和- output.library 这两个属性有关系了
