---
layout: post
title: "https"
subtitle: ""
author: "ZJT"
header-style: text
tags:
  - http
---

### tree-shaking 作用

主要还是为了减少页面的加载时间，将无用的代码删除，减少js包的大小，从而减少用户等待的时间，使用户不因为漫长的等待而离开。

### tree-shaking实现的原理

tree shaking得以实现，是依赖es6的module模块的。是es6的模块特性，奠定了tree shaking的实现基础。
关于es6 module的特性，大概有如下几点：
1.必须写在最外层，不能写在函数里
2.import的语句具有和var一样的提升(hoist)特性。

tree shaking首先会分析文件项目里具体哪些代码被引入了，哪些没有引入，然后将真正引入的代码打包进去，最后没有使用到的代码自然就不会存在了。

### tree-shaking在webpack中

babel-loader先去处理js文件，处理过后，webpack进行打包处理，最后uglifyjs进行代码压缩。而关键就是babel怎么去处理js文件

babel的配置文件中有一个preset配置项：
```
{
  "presets": [
    ["env", {
      "modules": false  //关键点
    }],
    "stage-2",
    "react"
  ]
}

```
其中presets里面的env的options中有一个 modules: false,这是指示babel如何去处理import和exports等关键子，默认处理成require形式。如果加上此option，那么babel就不会吧import形式，转变成require形式。为webpack进行tree-shaking创造了条件。
babel首先处理js文件，真正进行tree-shaking识别和记录的是webpack本身。删除多于代码是在uglify中执行的

tree-shaking本质上是不能对大部分的第三方类库进行tree-shaking的.上面的实战代码，对于自己写的代码还有点用，但是只要涉及到第三方类库，基本就是歇菜。

这样的文件结构是无法进行tree-shaking的
```
// 只要是你在代码中引用了一个方法，那么你肯定将所有的代码都引入了进来
import {path} from 'ramda' 
```
唯一的解决方法就是直接到具体的文件夹去引用，而不是在根index.js里面去引用。
```
import path from 'ramda/src/path'
```
但是如果每一次引用都是这样去写，开发的效率就无法保证，所以基本上有点追求的技术团队，基本上会再类库的基础上，开发一个babel的插件以支持代码的tree-shaking。

babel-plugin-ramda:此插件会默认将你写的代码转化为tree-shaking的代码
```
from:

import {path} from 'ramda' 

to

import path from 'ramda/src/path'
```












