---
layout: post
title: "实现EventEmitter"
subtitle: ""
author: "ZJT"
header-style: text
tags:
  - js
---

实现一个EventEmitter类，这个类包含以下方法： on（监听事件，该事件可以被触发多次）- once（也是监听事件，但只能被触发一次）- fire（触发指定的事件）- off（移除指定事件的某个回调方法或者所有回调方法）

```
class EventEmitter {
  constructor() {
    this.handlers = {};
  }
  on(eventName, handle) {
    if(!this.handlers.hasOwnProperty(eventName)) {
      this.handlers[eventName] = [];
    }
    this.handlers[eventName].push(handle);
  }
  once(eventName, handle) {
    if(!this.handlers.hasOwnProperty(eventName)) {
      this.handlers[eventName].push(handle)
    } else {
      this.handlers[eventName] = [handle];
    }
  }
  fire(eventName, ...params) {
    if(!this.handlers.hasOwnProperty(eventName)) return ;
    this.handlers[eventName].map(handle => handle(...params))
  }
  off(eventName, handle) {
    if(!this.handlers.hasOwnProperty(eventName)) return ;
    let index = this.handlers[eventName].indexOf(handle);
    this.handlers[eventName].splice(index, 1);
  }
}

const emitter = new EventEmitter();
emitter.on('go1', (val) => {
  console.log(val + '-go1')
})
emitter.on('go2', (val) => {
  console.log(val + '-go2')
})
emitter.fire('go1', 123);
emitter.fire('go2', 234);
```








