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

2. 关闭浏览器时发送请求：使用navigator.sendBeacon发送异步请求
根据MDN的介绍：
>这个方法主要用于满足 统计和诊断代码 的需要，这些代码通常尝试在卸载（unload）文档之前向web服务器发送数据。过早的发送数据可能导致错过收集数据的机会。然而， 对于开发者来说保证在文档卸载期间发送数据一直是一个困难。因为用户代理通常会忽略在卸载事件处理器中产生的异步 XMLHttpRequest 。
为了解决这个问题， 统计和诊断代码通常要在 unload 或者 beforeunload 事件处理器中发起一个同步 XMLHttpRequest 来发送数据。同步的 XMLHttpRequest 迫使用户代理延迟卸载文档，并使得下一个导航出现的更晚。下一个页面对于这种较差的载入表现无能为力。
有一些技术被用来保证数据的发送。其中一种是通过在卸载事件处理器中创建一个图片元素并设置它的 src 属性的方法来延迟卸载以保证数据的发送。因为绝大多数用户代理会延迟卸载以保证图片的载入，所以数据可以在卸载事件中发送。另一种技术是通过创建一个几秒钟的 no-op 循环来延迟卸载并向服务器发送数据。
这些技术不仅编码模式不好，其中的一些甚至并不可靠而且会导致非常差的页面载入性能。
这就是 sendBeacon() 方法存在的意义。使用 sendBeacon() 方法会使用户代理在有机会时异步地向服务器发送数据，同时不会延迟页面的卸载或影响下一导航的载入性能。这就解决了提交分析数据时的所有的问题：数据可靠，传输异步并且不会影响下一页面的加载。此外，代码实际上还要比其他技术简单许多！

使用方式是这样的:
```
navigator.sendBeacon(url [, data]);
```
sendBeacon支持发送的data可以是ArrayBufferView, Blob, DOMString, 或者 FormData 类型的数据。

下面是几种使用sendBeacon发送请求的方式，可以修改header和内容的格式，因为一般和服务器的通信方式都是固定的，如果修改了header或者内容，服务器就无法正常识别出来了。

（1）使用Blob来发送

使用blob发送的好处是可以自己定义内容的格式和header。比如下面这种设置方式，就是可以设置content-type为application/x-
```
blob = new Blob([`room_id=123`], {type : 'application/x-www-form-urlencoded'});
navigator.sendBeacon("/cgi-bin/leave_room", blob);
```
（2）使用FormData对象，但是这时content-type会被设置成"multipart/form-data"。
```
var fd = new FormData();
fd.append('room_id', 123);
navigator.sendBeacon("/cgi-bin/leave_room", fd);
```
（3）数据也可以使用URLSearchParams 对象，content-type会被设置成"text/plain;charset=UTF-8" 。
```
var params = new URLSearchParams({ room_id: 123 })
navigator.sendBeacon("/cgi-bin/leave_room", params);
```
