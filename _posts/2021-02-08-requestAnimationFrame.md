---
layout: post
title: "requestAnimationFrame"
subtitle: ""
author: "ZJT"
header-style: text
tags:
  - js
---

一.requestAnimationFrame怎么执行的

1、首先判断 document.hidden 属性是否可见（true），可见状态下才能继续执行以下步骤

2、浏览器清空上一轮的动画函数

3、requestAnimationFrame 将回调函数追加到动画帧请求回调函数列表的末尾

我们需要注意的是：当执行 requestAnimationFrame(callback)的时候，不会立即调用 callback 回调函数，只是将其放入回调函数队列而已，同时注意，每个 callback回调函数都有一个 cancelled 标志符，初始值为 false，并对外不可见。

4、当页面可见并且动画帧请求callback回调函数列表不为空时，浏览器会定期将这些回调函数加入到浏览器 UI 线程的队列中（由系统来决定回调函数的执行时机）。当浏览器执行这些 callback 回调函数的时候，会判断每个元组的 callback 的cancelled标志符，只有 cancelled 为 false 时，才执行callback回调函数。

二：requestAnimationFrame优点有啥

1、requestAnimationFrame 自带函数节流功能，采用系统时间间隔，保持最佳绘制效率，不会因为间隔时间的过短，造成过度绘制，增加页面开销，也不会因为间隔时间过长，造成动画卡顿，不流程，影响页面美观。

浏览器的重绘频率一般会和显示器的刷新率保持同步。大多数采用 W3C规范，浏览器的渲染页面的标准频率也为 60 FPS（frames/per second）即每秒重绘60次，requestAnimationFrame的基本思想是 让页面重绘的频率和刷新频率保持同步，即每 1000ms / 60 = 16.7ms执行一次。

通过 requestAnimationFrame 调用回调函数引起的页面重绘或回流的时间间隔和显示器的刷新时间间隔相同。所以 requestAnimationFrame 不需要像 setTimeout 那样传递时间间隔，而是浏览器通过系统获取并使用显示器刷新频率。例如在某些高频事件（resize，scroll 等）中，使用 requestAnimationFrame 可以防止在一个刷新间隔内发生多次函数执行，这样保证了流程度，也节省了开销

2、该函数的延时效果是精确的，没有setTimeout或setInterval不准的情况（JS是单线程的，setTimeout 任务被放进异步队列中，只有当主线程上的任务执行完以后，才会去检查该队列的任务是否需要开始执行，造成时间延时）。

setTimeout的执行只是在内存中对图像属性进行改变，这个改变必须要等到下次浏览器重绘时才会被更新到屏幕上。如果和屏幕刷新步调不一致，就可能导致中间某些帧的操作被跨越过去，直接更新下下一帧的图像。即 掉帧

使用 requestAnimationFrame 执行动画，最大优势是能保证回调函数在屏幕每一次刷新间隔中只被执行一次，这样就不会引起丢帧，动画也就不会卡顿

3、节省资源，节省开销

在之前介绍requestAnimationFrame执行过程，我们知道只有当页面激活的状态下，页面刷新任务才会开始，才执行 requestAnimationFrame，当页面隐藏或最小化时，会被暂停，页面显示，会继续执行。节省了 CPU 开销。

注意：当页面被隐藏或最小化时，定时器setTimeout仍在后台执行动画任务，此时刷新动画是完全没有意义的（实际上 FireFox/Chrome 浏览器对定时器做了优化：页面闲置时，如果时间间隔小于 1000ms，则停止定时器，与requestAnimationFrame行为类似。如果时间间隔>=1000ms，定时器依然在后台执行）

三：requestAnimationFrame实现setInterval及 setTimeout

1.setInterval

```
function setInterval1(cb, interval) {
    let timer;
    const now = Date.now;
    let startTime = now();
    let endTime = startTime;
    const loop = () => {
        timer = window.requestAnimationFrame(loop);
        endTime = now();
        if(endTime - startTime >= interval) {
            startTime = endTime = now();
            cb(timer);
        }
    }
    timer = window.requestAnimationFrame(loop);
    return timer;
}
```

2.setTimeout

```
function setTimeout1(cb ,interval) {
  let timer;
  let now = Date.now;
  let startTime = now();
  const loop = () => {
    timer = window.requestAnimationFrame(loop);
    let endTime = now();
    if(endTime - startTime >= interval) {
      cb(timer);
      window.cancelAnimationFrame(timer);
    }
  }
  timer = window.requestAnimationFrame(loop);
  return timer;
}
```



















