---
layout: post
title: "JS常用设计模式"
subtitle: ""
author: "ZJT"
header-style: text
tags:
  - js
---

### 设计原则：

1. 单一职责原则（SRP）
一个对象或方法只做一件事情。如果一个方法承担了过多的职责，那么在需求的变迁过程中，需要改写这个方法的可能性就越大。
应该把对象或方法划分成较小的粒度

2. 最少知识原则（LKP）
一个软件实体应当 尽可能少地与其他实体发生相互作用 
应当尽量减少对象之间的交互。如果两个对象之间不必彼此直接通信，那么这两个对象就不要发生直接的 相互联系，可以转交给第三方进行处理

3. 开放-封闭原则（OCP）
软件实体（类、模块、函数）等应该是可以 扩展的，但是不可修改
当需要改变一个程序的功能或者给这个程序增加新功能的时候，可以使用增加代码的方式，尽量避免改动程序的源代码，防止影响原系统的稳定

### 一：单例模式

> 在执行当前 Single 只获得唯一一个对象单例模式，是一种常用的软件设计模式。在它的核心结构中只包含一个被称为单例的特殊类。通过单例模式可以保证系统中，应用该模式的一个类只有一个实例。即一个类只有一个对象实例。

```
var Single = (function(){
    var instance;
    function init() {
        // 定义私有方法和属性
        // 操作逻辑
        return {
           // 定义公共方法和属性
        };
    }
    return {
        // 获取实例
        getInstance:function(){
            if(!instance){
                instance = init();
            }
            return instance;
        }
    }
})();

var obj1 = Single.getInstance();
var obj2 = Single.getInstance();
console.log(obj1 === obj2);
```

### 二：工厂模式

>工厂模式是我们最常用的实例化对象模式了，是用工厂方法代替new操作的一种模式。
>因为工厂模式就相当于创建实例对象的new，我们经常要根据类Class生成实例对象，如A a=new A() 工厂模式也是用来创建实例对象的，所以以后new时就要多个心眼，是否可以考虑使用工厂模式，虽然这样做，可能多做一些工作，但会给你系统带来更大的可扩展性和尽量少的修改量。

```
function Animal(opts){
    var obj = new Object();
    obj.color = opts.color;
    obj.name= opts.name;
    obj.getInfo = function(){
        return '名称：'+ onj.name+'， 颜色：'+ obj.color;
    }
    return obj;
}
var cat = Animal({name: '波斯猫', color: '白色'});
cat.getInfo();
```

### 三：构造函数模式

>  ECMAScript中的构造函数可用来创建特定类型的对象，像Array和Object这样的原生构造函数，在运行时会自动出现在执行环境中。此外，也可以创建自定义的构造函数，从而定义自定义对象的属性和方法。使用构造函数的方法，既解决了重复实例化的问题，又解决了对象识别的问题。

```
function Animal(name, color){
    this.name = name;
    this.color = color;
    this.getName = function(){
        return this.name;
    }
}
// 实例一个对象
var cat = new Animal('猫', '白色');
console.log( cat.getName() );
```

### 四：订阅/发布模式（subscribe & publish）

> text属性变化了，set方法触发了，但是文本节点的内容没有变化。 如何才能让同样绑定到text的文本节点也同步变化呢？ 这里又有一个知识点： 订阅发布模式。
　　订阅发布模式又称为观察者模式，定义了一种一对多的关系，让多个观察者同时监听某一个主题对象，这个主题对象的状态发生改变时就会通知所有的观察者对象。
发布者发出通知 =>主题对象收到通知并推送给订阅者 => 订阅者执行相应的操作。

```
// 一个发布者 publisher，功能就是负责发布消息 - publish
var pub = {
    publish: function () {
        dep.notify();
    }
}
// 多个订阅者 subscribers， 在发布者发布消息之后执行函数
var sub1 = { 
    update: function () {
        console.log(1);
    }
}
var sub2 = { 
    update: function () {
        console.log(2);
    }
}
var sub3 = { 
    update: function () {
        console.log(3);
    }
}
// 一个主题对象
function Dep() {
    this.subs = [sub1, sub2, sub3];
}
Dep.prototype.notify = function () {
    this.subs.forEach(function (sub) {
        sub.update();
    });
}

// 发布者发布消息， 主题对象执行notify方法，进而触发订阅者执行Update方法
var dep = new Dep();
pub.publish();
```



