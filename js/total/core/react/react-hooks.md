#### useState

useState()会返回一个数组。上面数组的第一项是一个可以访问状态值的变量。第二项是一个能够更新组件状态，而且影响 dom 变化的函数。

```
import { useState } from 'react'
const [state, setState] = useState({ counter: 0 })
```

#### useEffect

类似 Component 组件，使用生命周期方法来管理副作用，例如 componentDidMount()。useEffect() 函数允许您在函数组件中执行副作用。
默认情况下，useEffect 在每次完成渲染后运行。但是，您可以选择仅在某些值发生更改时触发它，并将一个数组作为第二个可选参数传递。

```
// 没有第二个参数
useEffect(() => {
  console.log('每次render之后运行)
})
// 有第二个参数[valueA]
useEffect(() => {
  console.log('只有valueA变化了才运行')
},[valueA])
```

要获得与 componentDidMount() 相同的结果，我们可以发送一个空数组。空数组不会改变，useEffect 只会运行一次。

使用空数组调用 useEffect(function，[]）与 componentDidMount() 具有相同的用途。但是，如果第一个参数中使用的函数返回另一个函数，则第二个函数将在卸载组件之前触发。完全像 componentWillUnmount()。
