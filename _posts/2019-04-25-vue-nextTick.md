---
layout: post
title: "vue nextTick原理"
subtitle: ""
author: "ZJT"
header-style: text
tags:
  - vue
---

### 官方文档说明

> `Vue.nextTick( [callback, context] )` 在下次 DOM 更新循环结束之后执行延迟回调。在修改数据之后立即使用这个方法，获取更新后的 DOM。

具体来说，异步执行的运行机制如下：

- 所有同步任务都在主线程上执行，形成一个执行栈（execution context stack）。
- 主线程之外，还存在一个"任务队列"（task queue）。只要异步任务有了运行结果，就在"任务队列"之中放置一个事件。
- 一旦"执行栈"中的所有同步任务执行完毕，系统就会读取"任务队列"，看看里面有哪些事件。那些对应的异步任务，于是结束等待状态，进入执行栈，开始执行。
- 主线程不断重复上面的第三步。

### 任务队列

1. 任务队列的类型

任务队列存在两种类型，一种为 microtask queue，另一种为 macrotask queue。  
microtask queue：唯一，整个事件循环当中，仅存在一个；执行为同步，同一个事件循环中的 microtask 会按队列顺序，串行执行完毕；  
macrotask queue：不唯一，存在一定的优先级（用户 I/O 部分优先级更高）；异步执行，同一事件循环中，只执行一个。  
microtask queue 中的所有 callback 处在同一个事件循环中，而 macrotask queue 中的 callback 有自己的事件循环。  
简而言之：同步环境执行 -> 事件循环 1（microtask queue 的 All）-> 事件循环 2(macrotask queue 中的一个) -> 事件循环 1（microtask queue 的 All）-> 事件循环 2(macrotask queue 中的一个)...  
利用 microtask queue 可以形成一个同步执行的环境，但如果 Microtask queue 太长，将导致 Macrotask 任务长时间执行不了，最终导致用户 I/O 无响应等，所以使用需慎重。  
实例：

```
console.log('1, time = ' + new Date().toString())
setTimeout(macroCallback, 0);
new Promise(function(resolve, reject) {
    console.log('2, time = ' + new Date().toString())
    resolve();
    console.log('3, time = ' + new Date().toString())
}).then(microCallback);

function macroCallback() {
    console.log('4, time = ' + new Date().toString())
}

function microCallback() {
    console.log('5, time = ' + new Date().toString())
}

//运行结果

1 2 3 5 4
```

现在我们知道了。在事件循环中，用户代理会不断从 task 队列中按顺序取 task 执行，每执行完一个 task 都会检查 microtask 队列是否为空（执行完一个 task 的具体标志是函数执行栈为空），如果不为空则会一次性执行完所有 microtask。然后再进入下一个循环去 task 队列中取下一个 task 执行...

那么哪些行为属于 task 或者 microtask 呢？标准没有阐述，但各种技术文章总结都如下：

- macrotasks: script(整体代码), setTimeout, setInterval, setImmediate, I/O, UI rendering
- microtasks: process.nextTick, Promises, Object.observe(废弃), MutationObserver

### 事件循环说明

简单来说，Vue 在修改数据后，视图不会立刻更新，而是等同一事件循环中的所有数据变化完成之后，再统一进行视图更新。例如：

```
//改变数据
vm.message = 'changed'

//想要立即使用更新后的DOM。这样不行，因为设置message后DOM还没有更新
console.log(vm.$el.textContent) // 并不会得到'changed'

//这样可以，nextTick里面的代码会在DOM更新后执行
Vue.nextTick(function(){
    console.log(vm.$el.textContent) //可以得到'changed'
})
```

事件循环：

1. 首先修改数据，这是同步任务。同一事件循环的所有的同步任务都在主线程上执行，形成一个执行栈，此时还未涉及 DOM 。
2. Vue 开启一个异步队列，并缓冲在此事件循环中发生的所有数据改变。如果同一个 watcher 被多次触发，只会被推入到队列中一次。

同步任务执行完毕，开始执行异步 watcher 队列的任务，更新 DOM 。Vue 在内部尝试对异步队列使用原生的 Promise.then 和 MessageChannel 方法，如果执行环境不支持，会采用 setTimeout(fn, 0) 代替。

此时通过 Vue.nextTick 获取到改变后的 DOM 。通过 setTimeout(fn, 0) 也可以同样获取到。

简单总结事件循环：

同步代码执行 -> 查找异步队列，推入执行栈，执行`Vue.nextTick[事件循环1]` ->查找异步队列，推入执行栈，执行`Vue.nextTick[事件循环2]`...

总之，异步是单独的一个 tick，不会和同步在一个 tick 里发生，也是 DOM 不会马上改变的原因。

### 用途

> 应用场景：需要在视图更新之后，基于新的视图进行操作。

需要注意的是，在 created 和 mounted 阶段，如果需要操作渲染后的试图，也要使用 nextTick 方法。

官方文档说明：

> 注意 mounted 不会承诺所有的子组件也都一起被挂载。如果你希望等到整个视图都渲染完毕，可以用 vm.\$nextTick 替换掉 mounted

```
mounted: function () {
  this.$nextTick(function () {
    // Code that will run only after the
    // entire view has been rendered
  })
}
```

### 其他应用场景

1. 点击按钮显示原本以 v-show = false 隐藏起来的输入框，并获取焦点。

```
showsou(){
  this.showit = true //修改 v-show
  document.getElementById("keywords").focus()  //在第一个 tick 里，获取不到输入框，自然也获取不到焦点
}
```

修改为：

```
showsou(){
  this.showit = true
  this.$nextTick(function () {
    // DOM 更新了
    document.getElementById("keywords").focus()
  })
}
```

2. 点击获取元素宽度。

```
<div id="app">
    <p ref="myWidth" v-if="showMe">{{ message }}</p>
    <button @click="getMyWidth">获取p元素宽度</button>
</div>

getMyWidth() {
    this.showMe = true;
    //this.message = this.$refs.myWidth.offsetWidth;
    //报错 TypeError: this.$refs.myWidth is undefined
    this.$nextTick(()=>{
        //dom元素更新后执行，此时能拿到p元素的属性
        this.message = this.$refs.myWidth.offsetWidth;
  })
}
```
