---
layout: post
title: "react"
subtitle: ""
author: "ZJT"
header-style: text
tags:
  - react
---

React 中 constructor 是唯一可以初始化 state 的地方，也可以把它理解成一个钩子函数，该函数最先执行且只执行一次。

更新状态不要直接修改 this.state。虽然状态可以改变，但不会触发组件的更新。

应当使用 this.setState()，该方法接收两种参数：对象或函数。

1. 对象：即想要修改的 state
2. 函数：接收两个函数，第一个函数接受两个参数，第一个是当前 state，第二个是当前 props，该函数返回一个对象，和直接传递对象参数是一样的，就是要修改的 state；第二个函数参数是 state 改变后触发的回调。

回到主题，setState 可能是异步的。对此官方有这样一段描述：setState() does not always immediately update the component. It may batch or defer the update until later. This makes reading this.state right after calling setState()a potential pitfall.

要探究 setState 为什么可能是异步的，先了解 setState 执行后会发生什么？

事实上 setState 内部执行过程是很复杂的，大致过程包括更新 state，创建新的 VNode，再经过 diff 算法比对差异，决定渲染哪一部分以及怎么渲染，最终形成最新的 UI。这一过程包含组件的四个生命周期函数。

- shouleComponentUpdate
- componentWillUpdate
- render
- componentDidUpdate

需要注意的是如果子组件的数据依赖于父组件，还会执行一个钩子函数 componentWillReceiveProps。

假如 setState 是同步更新的，每更新一次，这个过程都要完整执行一次，无疑会造成性能问题。事实上这些生命周期为纯函数，对性能还好，但是 diff 比较、更新 DOM 总消耗时间和性能吧。

此外为了批次和效能，多个 setState 有可能在执行过程中还会被合并，所以 setState 延时异步更新是很合理的。

#### setState 何时同步何时异步？

由 React 控制的事件处理程序，以及生命周期函数调用 setState 不会同步更新 state 。

React 控制之外的事件中调用 setState 是同步更新的。比如原生 js 绑定的事件，setTimeout/setInterval 等。

大部分开发中用到的都是 React 封装的事件，比如 onChange、onClick、onTouchMove 等，这些事件处理程序中的 setState 都是异步处理的。

```
constructor() {
  this.state = {
    count: 10
  }

  this.handleClickOne = this.handleClickOne.bind(this)
  this.handleClickTwo = this.handleClickTwo.bind(this)
}

render() {
  return (
    <button onClick={this.hanldeClickOne}>clickOne</button>
    <button onClick={this.hanldeClickTwo}>clickTwo</button>
    <button id="btn">clickTwo</button>
  )
}

handleClickOne() {
  this.setState({ count: this.state.count + 1})
  console.log(this.state.count)
}
```

输出：10

由此可以看出该事件处理程序中的 setState 是异步更新 state 的。

```
componentDidMount() {
  document.getElementById('btn').addEventListener('clcik', () => {
    this.setState({ count: this.state.count + 1})
    console.log(this.state.count)
  })
}
```

输出： 11

```
handleClickTwo() {
  setTimeout(() => {
    this.setState({ count: this.state.count + 1})
    console.log(this.state.count)
  }, 10)
}
```

输出： 11

以上两种方式绕过 React，通过 js 的事件绑定程序 addEventListener 和使用 setTimeout/setInterval 等 React 无法掌控的 APIs 情况下，setState 是同步更新 state。

React 是怎样控制异步和同步的呢？

在 React 的 setState 函数实现中，会根据一个变量 isBatchingUpdates 判断是直接更新 this.state 还是放到队列中延时更新，而 isBatchingUpdates 默认是 false，表示 setState 会同步更新 this.state；但是，有一个函数 batchedUpdates，该函数会把 isBatchingUpdates 修改为 true，而当 React 在调用事件处理函数之前就会先调用这个 batchedUpdates 将 isBatchingUpdates 修改为 true，这样由 React 控制的事件处理过程 setState 不会同步更新 this.state。

#### 多个 setState 调用会合并处理

```
render() {
  console.log('render')
}
hanldeClick() {
  this.setState({ name: 'jack' })
  this.setState({ age: 12 })
}
```

在 hanldeClick 处理程序中调用了两次 setState，但是 render 只执行了一次。因为 React 会将多个 this.setState 产生的修改放在一个队列里进行批延时处理。

#### 参数为函数的 setState 用法

```
handleClick() {
  this.setState({
    count: this.state.count + 1
  })
}
```

以上操作存在潜在的陷阱，不应该依靠它们的值来计算下一个状态。

```
handleClick() {
  this.setState({
    count: this.state.count + 1
  })
  this.setState({
    count: this.state.count + 1
  })
  this.setState({
    count: this.state.count + 1
  })
}
```

最终的结果只加了 1

因为调用 this.setState 时，并没有立即更改 this.state，所以 this.setState 只是在反复设置同一个值而已，上面的代码等同于这样

```
handleClick() {
  const count = this.state.count

  this.setState({
    count: count + 1
  })
  this.setState({
    count: count + 1
  })
  this.setState({
    count: count + 1
  })
}
```

count 相当于一个快照，所以不管重复多少次，结果都是加 1。

此外假如 setState 更新 state 后我希望做一些事情，而 setState 可能是异步的，那我怎么知道它什么时候执行完成。所以 setState 提供了函数式用法，接收两个函数参数，第一个函数调用更新 state，第二个函数是更新完之后的回调。

第一个函数接收先前的状态作为第一个参数，将此次更新被应用时的 props 做为第二个参数。

```
increment(state, props) {
  return {
    count: state.count + 1
  }
}

handleClick() {
  this.setState(this.increment)
  this.setState(this.increment)
  this.setState(this.increment)
}
```

结果: 13

对于多次调用函数式 setState 的情况，React 会保证调用每次 increment 时，state 都已经合并了之前的状态修改结果。

也就是说，第一次调用 this.setState(increment)，传给 increment 的 state 参数的 count 是 10，第二调用是 11，第三次调用是 12，最终 handleClick 执行完成后的结果就是 this.state.count 变成了 13。

值得注意的是：在 increment 函数被调用时，this.state 并没有被改变，依然要等到 render 函数被重新执行时（或者 shouldComponentUpdate 函数返回 false 之后）才被改变，因为 render 只执行一次。

让 setState 接受一个函数的 API 的设计是相当棒的！不仅符合函数式编程的思想，让开发者写出没有副作用的函数，而且我们并不去修改组件状态，只是把要改变的状态和结果返回给 React，维护状态的活完全交给 React 去做。正是把流程的控制权交给了 React，所以 React 才能协调多个 setState 调用的关系。

#### 在同一个事件处理程序中不要混用

```
increment(state, props) {
  return {
    count: state.count + 1
  }
}

handleClick() {
  this.setState(this.increment)
  this.setState({ count: this.state.count + 1 })
  this.setState(this.increment)
}
```

结果： 12

第一次执行 setState，count 为 11，第二次执行，this.state 仍然是没有更新的状态，所以 this.state.count 又打回了原形为 10，加 1 以后变成 11，最后再执行 setState，所以最终 count 的结果是 12。（render 依然只执行一次）

setState 的第二个回调参数会在更新 state，重新触发 render 后执行。
