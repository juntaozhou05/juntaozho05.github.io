---
layout: post
title: "JS中的文档碎片"
subtitle: ""
author: "ZJT"
header-style: text
tags:
  - js
---

### js 操作 dom 时发生了什么

每次对 dom 的操作都会触发"重排"（重新渲染界面，发生重绘或回流），这严重影响到能耗，一般通常采取的做法是尽可能的减少 dom 操作来减少"重排"

### 什么是文档碎片

document.createDocumentFragment() 一个容器，用于暂时存放创建的 dom 元素

### 文档碎片有什么用

1. 将需要添加的大量元素 先添加到文档碎片中，再将文档碎片添加到需要插入的位置，大大 减少 dom 操作，提高性能。
2. DocumentFragment 节点不属于文档树，继承的 parentNode 属性总是 null。它有一个很实用的特点，当请求把一个 DocumentFragment 节点插入文档树时，插入的不是 DocumentFragment 自身，而是它的所有子孙节点，即插入的是括号里的节点。这个特性使得 DocumentFragment 成了占位符，暂时存放那些一次插入文档的节点。它还有利于实现文档的剪切、复制和粘贴操作。
3. 如果使用 appendChid 方法将原 dom 树中的节点添加到 DocumentFragment 中时，会删除原来的节点。

**比如需要往页面上放 100 个元素：**

```
//普通方式：（操作了100次dom）
for(var i=100; i>0; i--){
  var elem = document.createElement('div');
  document.body.appendChild(elem);//放到body中
}
```

```
//文档碎片：(操作1次dom)
var df = document.createDocumentFragment();
  for(var i=100; i>0; i--){
    var elem = document.createElement('div');
    df.appendChild(elem);          }
  //最后放入到页面上
document.body.appendChild(df);
```
