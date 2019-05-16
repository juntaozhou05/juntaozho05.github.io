---
layout: post
title: "javascript函数式编程"
subtitle: ""
author: "ZJT"
header-style: text
tags:
  - js
---

### 函数式编程基础理论

1. 函数是一等公民。所谓”第一等公民”（first class），指的是函数与其他数据类型一样，处于平等地位，可以赋值给其他变量，也可以作为参数，传入另一个函数，或者作为别的函数的返回值。

2. 不可改变量。在函数式编程中，我们通常理解的变量在函数式编程中也被函数代替了：在函数式编程中变量仅仅代表某个表达式。这里所说的’变量’是不能被修改的。所有的变量只能被赋一次初值。

3. 此函数在相同的输入值时，总是产生相同的输出。函数的输出和当前运行环境的上下文状态无关。

4. 此函数运行过程不影响运行环境，也就是无副作用（如触发事件、发起 http 请求、打印/log 等）。
   简单来说，也就是当一个函数的输出不受外部环境影响，同时也不影响外部环境时，该函数就是纯函数，也就是它只关注逻辑运算和数学运算，同一个输入总得到同一个输出。

### javascript 内置函数有不少纯函数，也有不少非纯函数。

**纯函数：**

- Array.prototype.slice
- Array.prototype.map
- String.prototype.toUpperCase

**非纯函数：**

- Math.random
- Date.now
- Array.ptototype.splice

这里我们以 slice 和 splice 方法举例：

```
    var xs = [1,2,3,4,5];
    // 纯的
    xs.slice(0,3);
    //=> [1,2,3]
    xs.slice(0,3);
    //=> [1,2,3]
    xs.slice(0,3);
    //=> [1,2,3]

    // 不纯的
    xs.splice(0,3);
    //=> [1,2,3]
    xs.splice(0,3);
    //=> [4,5]
    xs.splice(0,3);
    //=> []
```

我们看到调用数组的 slice 方法每次返回的结果完全相同，同时 xs 不会被改变，而调用 splice 方法每次返回值都不一样，同时 xs 变得面目全非。

这就是我们强调使用纯函数的原因，因为纯函数相对于非纯函数来说，在可缓存性、可移植性、可测试性以及并行计算方面都有着巨大的优势。

这里我们以可缓存性举例：

```
var squareNumber  = memoize(function(x){ return x*x; });
squareNumber(4);
//=> 16
squareNumber(4); // 从缓存中读取输入值为 4 的结果
//=> 16
```

那我们如何把一个非纯函数变纯呢？比如下面这个函数：

```
var minimum = 21;
var checkAge = function(age) {
  return age >= minimum;
};
```

这个函数的返回值依赖于可变变量 minimum 的值，它依赖于系统状态。在大型系统中，这种对于外部状态的依赖是造成系统复杂性大大提高的主要原因。

```
var checkAge = function(age) {
  var minimum = 21;
  return age >= minimum;
};
```

通过改造，我们把 checkAge 变成了一个纯函数，它不依赖于系统状态，但是 minimum 是通过硬编码的方式定义的，这限制了函数的扩展性，我们可以在后面的柯里化中看到如何优雅的使用函数式解决这个问题。所以把一个函数变纯的基本手段是不要依赖系统状态。

### 函数柯里化

curry 的概念很简单：将一个低阶函数转换为高阶函数的过程就叫柯里化。

```
//es5写法
var add = function(x) {
  return function(y) {
    return x + y;
  };
};

//es6写法
var add = x => (y => x + y);

//试试看
var increment = add(1);
var addTen = add(10);

increment(2);  // 3

addTen(2);  // 12
```

对于加法这种极其简单的函数来说，柯里化并没有什么用。

还记得上面的 checkAge 函数吗？我们可以这样柯里化它：

```
var checkage = min => (age => age > min);
var checkage18 = checkage(18);
checkage18(20);
// =>true
```

这表明函数柯里化是一种“预加载”函数的能力，通过传递一到两个参数调用函数，就能得到一个记住了这些参数的新函数。从某种意义上来讲，这是一种对参数的缓存，是一种非常高效的编写函数的方法：

```
var curry = require('lodash').curry;

//柯里化两个纯函数
var match = curry((what, str) => str.match(what));
var filter = curry((f, ary) => ary.filter(f));

//判断字符串里有没有空格
var hasSpaces = match(/\s+/g);

hasSpaces("hello world");  // [ ' ' ]
hasSpaces("spaceless");  // null

var findSpaces = filter(hasSpaces);

findSpaces(["tori_spelling", "tori amos"]);  // ["tori amos"]
```

### 函数组合

假设我们需要对一个字符串做一些列操作，如下，为了方便举例，我们只对一个字符串做两种操作，我们定义了一个新函数 shout，先调用 toUpperCase，然后把返回值传给 exclaim 函数，这样做有什么不好呢？

不优雅，如果做得事情一多，嵌套的函数会非常深，而且代码是由内往外执行，不直观，我们希望代码从右往左执行，这个时候我们就得使用组合。

```
var toUpperCase = function(x) { return x.toUpperCase(); };
var exclaim = function(x) { return x + '!'; };

var shout = function(x){
  return exclaim(toUpperCase(x));
};

shout("send in the clowns");
//=> "SEND IN THE CLOWNS!"
```

使用组合，我们可以这样定义我们的 shout 函数：

```
//定义compose
var compose = (...args) => x => args.reduceRight((value, item) => item(value), x);

var toUpperCase = function(x) { return x.toUpperCase(); };
var exclaim = function(x) { return x + '!'; };

var shout = compose(exclaim, toUpperCase);

shout("send in the clowns");
//=> "SEND IN THE CLOWNS!"
```

代码从右往左执行，非常清晰明了，一目了然。

我们定义的 compose 像 N 面胶一样，可以将任意多个纯函数结合到一起。

这种灵活的组合可以让我们像拼积木一样来组合函数式的代码：

```
var head = function(x) { return x[0]; };
var reverse = reduce(function(acc, x){ return [x].concat(acc); }, []);
var last = compose(head, reverse);

last(['jumpkick', 'roundhouse', 'uppercut']);
//=> 'uppercut'
```
