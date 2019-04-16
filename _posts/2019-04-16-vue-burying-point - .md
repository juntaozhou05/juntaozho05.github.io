---
layout: post
title: "vue埋点方案"
subtitle: ""
author: "ZJT"
header-style: text
tags:
  - vue
---


### 一：背景

>埋点分析，是网站分析的一种常用的数据采集方法。数据埋点分为初级、中级、高级三种方式。数据埋点是一种良好的私有化部署数据采集方式。

1. 埋点技术如何采集数据，有何优缺点？
数据埋点分为初级、中级、高级三种方式，分别为：  
- 初级：在产品、服务转化关键点植入统计代码，据其独立ID确保数据采集不重复（如购买按钮点击率）；
- 中级：植入多段代码，追踪用户在平台每个界面上的系列行为，事件之间相互独立（如打开商品详情页——选择商品型号——加入购物车——下订单——购买完成）；
- 高级：联合公司工程、ETL采集分析用户全量行为，建立用户画像，还原用户行为模型，作为产品分析、优化的基础。

### 二：代码实现

1. 埋点方法代码

```
/**
 * @description 全埋点 
 *  1.在所有methods方法中埋点为函数名
 *  2.在钩子函数中 (activated - created - mounted) 依次寻找这三个钩子
 *    如果存在就会增加埋点 VIEW
 * 
 * 用法： 
 *   @Buried
 *   在单文件导出对象一级子对象下;
 *   如果某方法不想设置埋点 可以 return 'noBuried' 即可
 */
export function Buried(target, funcName, descriptor) {
  let oriMethods = Object.assign({},target.methods),
      oriTarget = Object.assign({},target);
  // methods方法中
  if(target.methods) {
    for(let name in target.methods) {
      target.methods[name] = function () {
        let result = oriMethods[name].call(this,...arguments);
        // 如果方法中返回 noBuried 则不添加埋点
        if(typeof result === 'string' && result.includes('noBuried')) {
          console.log(name + '方法设置不添加埋点');
        } else if(result instanceof Promise) {
          result.then(res => {
            if(typeof res === 'string' && res.includes('noBuried')) { console.log(name + '方法设置不添加埋点'); return; };
            console.log('添加埋点在methods方法中：' , name.toUpperCase ());
            this.$log(name);
          });
        }else{
          console.log('添加埋点在methods方法中：' , name.toUpperCase ());
          this.$log(name);
        };
        return result;
      }
    }
  }
  // 钩子函数中
  const hookFun = (funName) => {
    target[funName] = function() {
      let result =  oriTarget[funName].call(this,...arguments);
      console.log('添加埋点，在钩子函数' + funName + '中：', 'VIEW');
      this.$log('VIEW');
      return result;
    }
  }
  // 钩子函数中 view
  if (target.activated) {
    return hookFun('activated');
  } else if (target.created) {
    return hookFun('created');
  } else if (target.mounted) {
    return hookFun('mounted');
  };
}
```

2. 使用

```
import { Buried } from '@/libs/decorators';

@Buried
methods: {
   ...
}
```
此方法不局限在methods上是使用，只要是在单文件导出对象一级子对象下均可;
```
@Buried
components: {}
```
但是考虑到语义更加清晰建议在methods上使用此方法。  
- 考虑到并不是所有的方法都需要设置埋点，所以如果某方法不想设置埋点 可以 return 'noBuried' 即可忽略此方法不设埋点。
- 页面展现量统计在钩子函数中 (activated - created - mounted) 这三个钩子内，所以页面内至少有这个三个钩子之一才可统计页面展现量。

**注意：**

1. 通过接口请求来采集埋点的，每个埋点相当于一次请求，每做一步操作，需要埋点的地方就会发送一次请求，这样对服务器造成压力比较大，可以在页面呢做一个埋点收集 等到退出页面的时候再统一发送一次请求。