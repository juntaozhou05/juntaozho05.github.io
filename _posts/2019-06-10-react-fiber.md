---
layout: post
title: "react fiber"
subtitle: ""
author: "ZJT"
header-style: text
tags:
  - react
---

### 背景

1. React16 以前
   React16 以前，对 virtural dom 的更新和渲染是同步的。就是当一次更新或者一次加载开始以后，diff virtual dom 并且渲染的过程是一口气完成的。如果组件层级比较深，相应的堆栈也会很深，长时间占用浏览器主线程，一些类似用户输入、鼠标滚动等操作得不到响应。
2. React16 Fiber Reconciler
   React16 用了分片的方式解决上面的问题。
   就是把一个任务分成很多小片，当分配给这个小片的时间用尽的时候，就检查任务列表中有没有新的、优先级更高的任务，有就做这个新任务，没有就继续做原来的任务。这种方式被叫做异步渲染(Async Rendering)。

### Fiber 对开发者有什么影响

- componentWillMount componentWillReceiveProps componentWillUpdate 几个生命周期方法不再安全，由于任务执行过程可以被打断，这几个生命周期可能会执行多次，如果它们包含副作用（比如 AJax），会有意想不到的 bug。React 团队提供了替换的生命周期方法。建议如果使用以上方法，尽量用纯函数，避免以后采坑。

- 需要关注下 react 为任务片设置的优先级，特别是页面用动画的情况

### Fiber 的关键特性如下：

- 增量渲染（把渲染任务拆分成块，匀到多帧）
- 更新时能够暂停，终止，复用渲染任务
- 给不同类型的更新赋予优先级
- 并发方面新的基础能力

增量渲染用来解决掉帧的问题，渲染任务拆分之后，每次只做一小段，做完一段就把时间控制权交还给主线程，而不像之前长时间占用。这种策略叫做 cooperative scheduling（合作式调度），操作系统的 3 种任务调度策略之一（Firefox 还对真实 DOM 应用了这项技术）

### Fiber reconciler

> reconcile 过程分为 2 个阶段（phase）：

- （可中断）render/reconciliation 通过构造 workInProgress tree 得出 change
- （不可中断）commit 应用这些 DOM change

> render/reconciliation

以 fiber tree 为蓝本，把每个 fiber 作为一个工作单元，自顶向下逐节点构造 workInProgress tree（构建中的新 fiber tree）

具体过程如下（以组件节点为例）：

1. 如果当前节点不需要更新，直接把子节点 clone 过来，跳到 5；要更新的话打个 tag

2. 更新当前节点状态（props, state, context 等）

3. 调用 shouldComponentUpdate()，false 的话，跳到 5

4. 调用 render()获得新的子节点，并为子节点创建 fiber（创建过程会尽量复用现有 fiber，子节点增删也发生在这里）

5. 如果没有产生 child fiber，该工作单元结束，把 effect list 归并到 return，并把当前节点的 sibling 作为下一个工作单元；否则把 child 作为下一个工作单元

6. 如果没有剩余可用时间了，等到下一次主线程空闲时才开始下一个工作单元；否则，立即开始做

7. 如果没有下一个工作单元了（回到了 workInProgress tree 的根节点），第 1 阶段结束，进入 pendingCommit 状态

实际上是 1-6 的工作循环，7 是出口，工作循环每次只做一件事，做完看要不要喘口气。工作循环结束时，workInProgress tree 的根节点身上的 effect list 就是收集到的所有 side effect（因为每做完一个都向上归并）

所以，构建 workInProgress tree 的过程就是 diff 的过程，通过 requestIdleCallback 来调度执行一组任务，每完成一个任务后回来看看有没有插队的（更紧急的），每完成一组任务，把时间控制权交还给主线程，直到下一次 requestIdleCallback 回调再继续构建 workInProgress tree

P.S.Fiber 之前的 reconciler 被称为 Stack reconciler，就是因为这些调度上下文信息是由系统栈来保存的。虽然之前一次性做完，强调栈没什么意义，起个名字只是为了便于区分 Fiber reconciler

> requestIdleCallback
> 通知主线程，要求在不忙的时候告诉我，我有几个不太着急的事情要做
> 具体用法如下：

```
window.requestIdleCallback(callback[, options])
// 示例
let handle = window.requestIdleCallback((idleDeadline) => {
    const {didTimeout, timeRemaining} = idleDeadline;
    console.log(`超时了吗？${didTimeout}`);
    console.log(`可用时间剩余${timeRemaining.call(idleDeadline)}ms`);
    // do some stuff
    const now = +new Date, timespent = 10;
    while (+new Date < now + timespent);
    console.log(`花了${timespent}ms搞事情`);
    console.log(`可用时间剩余${timeRemaining.call(idleDeadline)}ms`);
}, {timeout: 1000});
// 输出结果
// 超时了吗？false
// 可用时间剩余49.535000000000004ms
// 花了10ms搞事情
// 可用时间剩余38.64ms
```

注意，requestIdleCallback 调度只是希望做到流畅体验，并不能绝对保证什么，例如：

```
// do some stuff
const now = +new Date, timespent = 300;
while (+new Date < now + timespent);
```

> commit

第 2 阶段直接一口气做完：

1. 处理 effect list（包括 3 种处理：更新 DOM 树、调用组件生命周期函数以及更新 ref 等内部状态）
2. 出对结束，第 2 阶段结束，所有更新都 commit 到 DOM 树上了

注意，真的是一口气做完（同步执行，不能喊停）的，这个阶段的实际工作量是比较大的，所以尽量不要在后 3 个生命周期函数里干重活儿

> 生命周期 hook

生命周期函数也被分为 2 个阶段了：

```
// 第1阶段 render/reconciliation
componentWillMount
componentWillReceiveProps
shouldComponentUpdate
componentWillUpdate

// 第2阶段 commit
componentDidMount
componentDidUpdate
componentWillUnmount
```

第 1 阶段的生命周期函数可能会被多次调用，默认以 low 优先级（后面介绍的 6 种优先级之一）执行，被高优先级任务打断的话，稍后重新执行

### 如何试用 Fiber 异步渲染

默认情况下，异步渲染没有打开，如果你想试用，可以：

```
import React from 'react';
import ReactDOM from 'react-dom';
import App from 'components/App';

const AsyncMode = React.unstable_AsyncMode;
const createApp = (store) => (
      <AsyncMode>
        <App store={store} />
      </AsyncMode>
);

export default createApp;
```

代码将开启严格模式和异步模式，React16 不建议试用的 API 会在控制台有错误提示，比如 componentWillMount。

### Fiber 如何工作

Fiber 就是通过对象记录组件上需要做或者已经完成的更新，一个组件可以对应多个 Fiber。

在 render 函数中创建的 React Element 树在第一次渲染的时候会创建一颗结构一模一样的 Fiber 节点树。不同的 React Element 类型对应不同的 Fiber 节点类型。一个 React Element 的工作就由它对应的 Fiber 节点来负责。

一个 React Element 可以对应不止一个 Fiber，因为 Fiber 在 update 的时候，会从原来的 Fiber（我们称为 current）clone 出一个新的 Fiber（我们称为 alternate）。两个 Fiber diff 出的变化（side effect）记录在 alternate 上。所以一个组件在更新时最多会有两个 Fiber 与其对应，在更新结束后 alternate 会取代之前的 current 的成为新的 current 节点。

其次，Fiber 的基本规则：
更新任务分成两个阶段，Reconciliation Phase 和 Commit Phase。Reconciliation Phase 的任务干的事情是，找出要做的更新工作（Diff Fiber Tree），就是一个计算阶段，计算结果可以被缓存，也就可以被打断；Commmit Phase 需要提交所有更新并渲染，为了防止页面抖动，被设置为不能被打断。

PS: componentWillMount componentWillReceiveProps componentWillUpdate 几个生命周期方法，在 Reconciliation Phase 被调用，有被打断的可能（时间用尽等情况），所以可能被多次调用。其实 shouldComponentUpdate 也可能被多次调用，只是它只返回 true 或者 false，没有副作用，可以暂时忽略。

### 一些数据结构

- fiber 是个链表，有 child 和 sibing 属性，指向第一个子节点和相邻的兄弟节点，从而构成 fiber tree。return 属性指向其父节点
- 更新队列，updateQueue，是一个链表，有 first 和 last 两个属性，指向第一个和最后一个 update 对象。
- 每个 fiber 有一个属性 updateQueue 指向其对应的更新队列。
- 每个 fiber（当前 fiber 可以称为 current）有一个属性 alternate，开始时指向一个自己的 clone 体，update 的变化会先更新到 alternate 上，当更新完毕，alternate 替换 current。

### 整个流程

- 用户操作引起 setState 被调用以后，先调用 enqueueSetState 方法，该方法可以划分成两个阶段（非官方说法，是我个人观点），第一阶段 Data Preparation，是初始化一些数据结构，比如 fiber, updateQueue, update。
- 新的 update 会通过 insertUpdateIntoQueue 方法，根据优先级插入到队列的对应位置，ensureUpdateQueues 方法初始化两个更新队列，queue1 和 current.updateQueue 对应，queue2 和 current.alternate.updateQueue 对应。
- 第二阶段，Fiber Reconciler，就开始进行任务分片调度，scheduleWork 首先更新每个 fiber 的优先级，这里并没有 updatePriority 这个方法，但是干了这件事，我用虚线框表示。当 fiber.return === null，找到父节点，把所有 diff 出的变化（side effect）归结到 root 上。
- requestWork，首先把当前的更新添加到 schedule list 中（addRootToSchedule），然后根据当前是否为异步渲染（isAsync 参数），异步渲染调用。scheduleCallbackWithExpriation 方法，下一步高能
- scheduleCallbackWithExpriation 这个方法在不同环境，实现不一样，chrome 等览器中使用 requestIdleCallback API，没有这个 API 的浏览器中，通过 requestAnimationFrame 模拟一个 requestIdleCallback，来在浏览器空闲时，完成下一个分片的工作，注意，这个函数会传入一个 expirationTime，超过这个时间活没干完，就放弃了。
- 执行到 performWorkOnRoot，就是 fiber 文档中提到的 Commit Phase 和 Reconciliation Phase 两阶段（官方说法）。
- 第一阶段 Reconciliation Phase，在 workLoop 中，通过一个 while 循环，完成每个分片任务。
- performUnitOfWork 也可以分成两阶段，蓝色框表示。beginWork 是一个入口函数，根据 workInProgress 的类型去实例化不同的 react element class。workInProgress 是通过 alternate 挂载一些新属性获得的。
- 实例化不同的 react element class 时候会调用和 will 有关的生命周期方法。
- completeUnitOfWork 是进行一些收尾工作，diff 完一个节点以后，更新 props 和调用生命周期方法等。
- 然后进入 Commit Phase 阶段，这个阶段不能被打断，不再赘述。

### 任务如何分片及分片的优先级

任务分片，或者叫工作单元(work unit)，是怎么拆分的呢。因为在 Reconciliation Phase 任务分片可以被打断，如何拆分一个任务就很重要了。React16 中按照 fiber 进行拆分，也就是原来的虚拟 dom 节点。记不记得，开篇我们说到，初始化时候，一个虚拟 dom 树对应着一个结构一样的 fiber tree，只是两个树的节点带的信息有差异。

那么这些任务分片的优先级如何呢？

React v16.0.0 的优先级是这样划分的：

```
{
  NoWork: 0, // No work is pending.
  SynchronousPriority: 1, // For controlled text inputs. Synchronous side-effects.
  TaskPriority: 2, // Completes at the end of the current tick.
  HighPriority: 3, // Interaction that needs to complete pretty soon to feel responsive.
  LowPriority: 4, // Data fetching, or result from updating stores.
  OffscreenPriority: 5, // Won't be visible but do the work in case it becomes visible.
}
```

可以把 Priority 分为同步和异步两个类别，同步优先级的任务会在当前帧完成，包括 SynchronousPriority 和 TaskPriority。异步优先级的任务则可能在接下来的几个帧中被完成，包括 HighPriority、LowPriority 以及 OffscreenPriority。

React v16.3.2 的优先级，不再这么划分，分为三类：NoWork、sync、async，前两类可以认为是同步任务，需要在当前 tick 完成，过期时间为 null，最后一类异步任务会计算一个 expirationTime，在 workLoop 中，根据过期时间来判断是否进行下一个分片任务，scheduleWork 中更新任务优先级，也就是更新这个 expirationTime。

### 一个疑问

既然是每完成一个任务分片，就看看剩余时间是否够用，不够用就停止，让出主线程，够用就更新任务分片优先级并继续下一个高优先级任务分片，且任务分片的结果是可以被缓存的，为什么与 will 有关的三个生命周期函数会被多次执行？ 一个任务分片要么就是被完成、要么就是没有被完成，怎么会多次被执行？

从源码看，原因是异步渲染时候，会调用 requestIdleCallback API，在回调函数中可以获得当前 callback 参数（也就是 fiber 的分片任务）还能执行多久，如果时间不够，分片任务会被打断（使用 cancelIdleCallback API），下次就只能空闲时重新执行。

源码中，处理这个逻辑的函数 scheduleCallbackWithExpiration:

```
// cancelDeferredCallback在chrome等浏览器中就是cancelIdleCallback，没有实现这个API的浏览器，React会用requestAnimationFrame模拟一个该函数
// scheduleDeferredCallback同理，chrome等浏览器中是requestIdleCallback
function scheduleCallbackWithExpiration(expirationTime) {
  if (callbackExpirationTime !== NoWork) {
    // A callback is already scheduled. Check its expiration time (timeout).
    if (expirationTime > callbackExpirationTime) {
      // Existing callback has sufficient timeout. Exit.
      return;
    } else {
      // Existing callback has insufficient timeout. Cancel and schedule a
      // new one.
      cancelDeferredCallback(callbackID);
    }
    // The request callback timer is already running. Don't start a new one.
  } else {
    startRequestCallbackTimer();
  }

  // Compute a timeout for the given expiration time.
  var currentMs = now() - originalStartTimeMs;
  var expirationMs = expirationTimeToMs(expirationTime);
  var timeout = expirationMs - currentMs;

  callbackExpirationTime = expirationTime;
  callbackID = scheduleDeferredCallback(performAsyncWork, { timeout: timeout });
}
```
