---
layout: post
title: "react16生命周期执行顺序测试"
subtitle: ""
author: "ZJT"
header-style: text
tags:
  - react
---

#### 首次渲染

```
father constructor
father getDerivedStateFromProps
father render
children constructor
children getDerivedStateFromProps
children render
children componentDidMount
father componentDidMount
```

#### 父组件数据修改触发重渲染

```
father getDerivedStateFromProps
father shouldComponentUpdate
father render
children getDerivedStateFromProps
children shouldComponentUpdate
children render
children getSnapshotBeforeUpdate
father getSnapshotBeforeUpdate
children componentDidUpdate, snapshot: 1
father componentDidUpdate, snapshot: 1
```

#### 父组件调用 forceUpdate

```
father getDerivedStateFromProps
father render
children getDerivedStateFromProps
children shouldComponentUpdate
children render
children getSnapshotBeforeUpdate
father getSnapshotBeforeUpdate
children componentDidUpdate, snapshot: 1
father componentDidUpdate, snapshot: 1
```

#### 销毁

```
father componentWillUnmount
children componentWillUnmount
```

#### 旧生命周期在各个阶段的调用情况

1. 挂载

- constructor
- componentWillMount
- render
- componentDidMount

2. 更新

- componentWillReceiveProps
- shouldComponentUpdate
- componentWillUpdate
- render
- componentDidUpdate

3. componentWillUnmount

#### 新生命周期在各个阶段的调用情况

1. 挂载

- constructor
- getDerivedStateFromProps
- render
- componentDidMount

2. 更新

- getDerivedStateFromProps
- shouldComponentUpdate
- render
- getSnapshotBeforeUpdate
- componentDidUpdate

3. 卸载

- componentWillUnmount

#### 父子组件之间的生命周期函数的调用顺序

- 挂载阶段，只有当执行到 render 的时候，父组件的 constructor 才开始执行，直到子组件挂载完成（componentDidMount），父组件才算挂载完成
- 更新阶段，类似挂载阶段，只有父组件执行到 render，才开始子组件的 getDerivedStateFromProps -> shouldComponentUpdate -> render，但再父组件的 getSnapshotBeforeUpdate 是紧随在子组件的 getSnapshotBeforeUpdate 后，然后子组件在 componentDidUpdate

#### 父组件调用 forceUpdate

- 组件调用 forceUpdate 方法后，不会执行 shouldComponentUpdate，会执行 getDerivedStateFromProps，然后再 render，后面的生命周期和更新一致
