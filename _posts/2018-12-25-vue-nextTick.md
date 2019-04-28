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

### 扩展：node 的事件循环机制

nodejs 具有事件驱动和非阻塞但线程的特点，使相关应用变得比较轻量和高效。当应用程序需要相关 I/O 操作时，线程并不会阻塞，而是把 I/O 操作移交给底层类库（如：libuv）。此时 nodejs 线程会去处理其他的任务，当底层库处理完相关的 I/O 操作后，会将主动权再次交还给 nodejs 线程。因此 event loop 的作用就是起到调度线程的作用，如当底层类库处理 I/O 操作后调度 nodejs 单线程处理后续的工作。也就是说当 nodejs 程序启动的时候，它会开启一个 event loop 以实现异步的 api 调度、schedule timers 、回调 process.nextTick()。
从上也可以看出 nodejs 虽说是单线程，但是在底层类库处理异步操作的时候仍然是多线程。

下面是一个 libuv 引擎中的事件循环的模型:

┌───────────────────────┐
┌─>│ timers │
│ └──────────┬────────────┘
│ ┌──────────┴────────────┐
│ │ I/O callbacks │
│ └──────────┬────────────┘
│ ┌──────────┴────────────┐
│ │ idle, prepare │
│ └──────────┬────────────┘ ┌───────────────┐
│ ┌──────────┴────────────┐ │ incoming: │
│ │ poll │<──connections─── │
│ └──────────┬────────────┘ │ data, etc. │
│ ┌──────────┴────────────┐ └───────────────┘
│ │ check │
│ └──────────┬────────────┘
│ ┌──────────┴────────────┐
└──┤ close callbacks │
└───────────────────────┘
注：模型中的每一个方块代表事件循环的一个阶段

上述的五个阶段都是按照先进先出的规则执行回调函数。按顺序执行每个阶段的回调函数队列，直至队列为空或是该阶段执行的回调函数达到该阶段所允许一次执行回调函数的最大限制后，才会将操作权移交给下一阶段。

每个阶段的简单概要：

- timers: 执行 setTimeout() 和 setInterval() 预先设定的回调函数。
- I/O callbacks: 大部分执行都是 timers 阶段或是 setImmediate() 预先设定的并且出现异常的回调函数事件。
- idle, prepare: nodejs 内部函数调用。
- poll: 搜寻 I/O 事件，nodejs 进程在这个阶段会选择在该阶段适当的阻塞一段时间。
- check: setImmediate() 函数会在这个阶段执行。
- close callbacks: 执行一些诸如关闭事件的回调函数，如 socket.on('close', ...) 。

**每个阶段的详细内容：**

poll:该阶段主要是两个任务：

1. 当 timers 的定时器到时后，执行定时器（setTimeout 和 setInternal）的回调函数。
2. 执行 poll 队列里面的 I/O 队列。
   值得注意的是，poll 阶段在执行 poll queue 中的回调时实际上不会无限的执行下去。有两种情况 poll 阶段会终止执行 poll queue 中的下一个回调：1.所有回调执行完毕。2.执行数超过了 node 的限制。

timers:

指定线程执行定时器（setTimeout 和 setInterval）的回调函数，但是大多数的时候定时器的回调函数执行的时间要远大于定时器设定的时间。因为必须要等 poll phrase 中的 poll queue 队列为空时，poll 才会去查看 timer 中有没有到期的定时器然后去执行定时器中的回调函数。

I/O callbacks:

该阶段执行一些诸如 TCP 的 errors 回调函数。

check:

如果 poll 中已没有排队的队列，并且存在 setImmediate() 立即执行的回调函数，这是 event loop 不会在 poll 阶段阻塞等待相应的 I/O 事件，而是直接去 check 阶段执行 setImmediate() 函数。

close callback:

该阶段执行 close 的事件函数。

**process.nextTick,setTimeout 与 setImmediate 的区别与使用场景**

1. process.nextTick()函数

- 尽管 process.nextTick()也是一个异步的函数，但是它并没有出现在上面 event loop 的结构图中。不管当前正在 event loop 的哪个阶段，在当前阶段执行完毕后，跳入下个阶段前的瞬间执行 process.nextTick()函数。
- 由于 process.nextTick()函数的特性，很可能出现一种恶劣的情形：在 event loop 进入 poll 前调用该函数，就会阻止程序进入 poll 阶段 allows you to "starve" your I/O by making recursive process.nextTick() calls。
- 但是也正是 nodejs 的一个设计哲学：每个函数都可以是异步的，即使它不必这样做。例如下面程序片段，如果不对内部函数作异步处理就可能出现异常。

```
let bar;

// this has an asynchronous signature, but calls callback synchronously
function someAsyncApiCall(callback) { callback(); }

// the callback is called before `someAsyncApiCall` completes.
someAsyncApiCall(() => {

  // since someAsyncApiCall has completed, bar hasn't been assigned any value
  console.log('bar', bar); // undefined

});

bar = 1;
```

由于 someAsyncApiCall 函数在执行时，内部函数是同步的，这是变量 bar 还没有被赋值。如果改为下面的就会这个异常。

```
let bar;

function someAsyncApiCall(callback) {
  process.nextTick(callback);
}

someAsyncApiCall(() => {
  console.log('bar', bar); // 1
});

bar = 1;
```

两者的比较

- process.nextTick() 函数是在任何阶段执行结束的时刻
- setImmediate() 函数是在 poll 阶段后进去 check 阶段事执行

process.nextTick() 函数的应用

- 允许线程在进入 event loop 下一个阶段前做一些关于处理异常、清理一些无用或无关的资源。l 例如下面：

```
function apiCall(arg, callback) {
  if (typeof arg !== 'string')
    return process.nextTick(callback,
    new TypeError('argument should be string'));
}
```

- 在进入下个 event loop 阶段前，并且回调函数还没有释放回调权限时执行一些相关操作。如下代码：

```
const EventEmitter = require('events');
const util = require('util');

function MyEmitter() {
  EventEmitter.call(this);

  // use nextTick to emit the event once a handler is assigned
  process.nextTick(function() {
    this.emit('event');
  }.bind(this));
}
util.inherits(MyEmitter, EventEmitter);

const myEmitter = new MyEmitter();
myEmitter.on('event', function() {
  console.log('an event occurred!');
});
```

在 MyEmitter 构造函数实例化前注册“event”事件，这样就可以保证实例化后的函数可以监听“event”事件。

2. setTimeout()和 setImmediate()

在三个方法中，这两个方法最容易被弄混。实际上，某些情况下这两个方法的表现也非常相似。然而实际上，这两个方法的意义却大为不同。

setTimeout()方法是定义一个回调，并且希望这个回调在我们所指定的时间间隔后第一时间去执行。注意这个“第一时间执行”，这意味着，受到操作系统和当前执行任务的诸多影响，该回调并不会在我们预期的时间间隔后精准的执行。执行的时间存在一定的延迟和误差，这是不可避免的。node 会在可以执行 timer 回调的第一时间去执行你所设定的任务。

setImmediate()方法从意义上将是立刻执行的意思，但是实际上它却是在一个固定的阶段才会执行回调，即 poll 阶段之后。有趣的是，这个名字的意义和之前提到过的 process.nextTick()方法才是最匹配的。node 的开发者们也清楚这两个方法的命名上存在一定的混淆，他们表示不会把这两个方法的名字调换过来---因为有大量的 node 程序使用着这两个方法，调换命名所带来的好处与它的影响相比不值一提。

setTimeout()和不设置时间间隔的 setImmediate()表现上及其相似。猜猜下面这段代码的结果是什么？

```
setTimeout(() => {
    console.log('timeout');
}, 0);

setImmediate(() => {
    console.log('immediate');
});
```

实际上，答案是不一定。没错，就连 node 的开发者都无法准确的判断这两者的顺序谁前谁后。这取决于这段代码的运行环境。运行环境中的各种复杂的情况会导致在同步队列里两个方法的顺序随机决定。但是，在一种情况下可以准确判断两个方法回调的执行顺序，那就是在一个 I/O 事件的回调中。下面这段代码的顺序永远是固定的：

```
const fs = require('fs');

fs.readFile(__filename, () => {
    setTimeout(() => {
        console.log('timeout');
    }, 0);
    setImmediate(() => {
        console.log('immediate');
    });
});
```

答案永远是：

immediate
timeout
因为在 I/O 事件的回调中，setImmediate 方法的回调永远在 timer 的回调前执行。
