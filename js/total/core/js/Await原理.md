### async/await

async/await 是参照 Generator 封装的一套异步处理方案，可以理解为 Generator 的语法糖，

所以了解 async/await 就不得不讲一讲 Generator,

而 Generator 又依赖于迭代器 Iterator，

所以就得先讲一讲 Iterator,

而 Iterator 的思想呢又来源于单向链表，

终于找到源头了：单向链表

#### 1. 单向链表

> wiki：链表（Linked list）是一种常见的基础数据结构，是一种线性表，但是并不会按线性的顺序储存数据，而是在每一个节点里存到下一个节点的指针（Pointer）。由于不必须按顺序储存，链表在插入的时候可以达到 o(1)的复杂度，比另一种线性表顺序表快得多，但是查找一个节点或者访问特定编号的节点则需要 o(n)的时间，而顺序表响应的时间复杂度分别是 o(logn)和 o(1)。

总结一下链表优点：

- 无需预先分配内存
- 插入/删除节点不影响其他节点，效率高（典型的例子：dom 操作）

单向链表：是链表中最简单的一种，它包含两个域，一个信息域和一个指针域。这个链接指向列表中的下一个节点，而最后一个节点则指向一个空值。

一个单向链表包含两个值: 当前节点的值和一个指向下一个节点的链接

单链特点：节点的链接方向是单向的；相对于数组来说，单链表的的随机访问速度较慢，但是单链表删除/添加数据的效率很高。

理解 js 原型链/作用域链的话，理解这个很容易，他们是相通的。

那么如何设计一个单向链表呢？这个取决于我们需要哪些操作，通常有：

- append(element)：追加节点
- insert(element,index)：在索引位置插入节点
- remove(element)：删除第一个匹配到的节点
- removeAt(index)：删除指定索引节点
- removeAll(element)：删除所有匹配的节点
- get(index)：获取指定索引的节点信息
- set(element,index)：修改指定索引的节点值
- indexOf(element)：获取某节点的索引位置
- clear()：清除所有节点
- length()：返回节点长度
- printf()：打印节点信息

#### 2. Iterator

Iterator 翻译过来就是**迭代器（遍历器）**让我们先来看看它的遍历过程(类似于单向链表):

- 创建一个指针对象，指向当前数据结构的起始位置
- 第一次调用指针对象的 next 方法，将指针指向数据结构的第一个成员
- 第二次调用指针对象的 next 方法，将指针指向数据结构的第二个成员
- 不断的调用指针对象的 next 方法，直到它指向数据结构的结束位置

一个对象要变成可迭代的，必须实现 @@iterator 方法，即对象（或它原型链上的某个对象）必须有一个名字是 Symbol.iterator 的属性（原生具有该属性的有：字符串、数组、类数组的对象、Set 和 Map）

当一个对象需要被迭代的时候（比如开始用于一个 for..of 循环中），它的 @@iterator 方法被调用并且无参数，然后返回一个用于在迭代中获得值的迭代器

迭代器协议：产生一个有限或无限序列的值，并且当所有的值都已经被迭代后，就会有一个默认的返回值

当一个对象只有满足下述条件才会被认为是一个迭代器：

它实现了一个 next() 的方法，该方法必须返回一个对象,对象有两个必要的属性：

- done（bool）
  - true：迭代器已经超过了可迭代次数。这种情况下,value 的值可以被省略
  - 如果迭代器可以产生序列中的下一个值，则为 false。这等效于没有指定 done 这个属性
- value 迭代器返回的任何 JavaScript 值。done 为 true 时可省略

根据上面的规则，咱们来自定义一个简单的迭代器：

```
const makeIterator = arr => {
  let nextIndex = 0;
  return {
    next: () =>
      nextIndex < arr.length
        ? { value: arr[nextIndex++], done: false }
        : { value: undefined, done: true },
  };
};
const it = makeIterator(['人月', '神话']);
console.log(it.next()); // { value: "人月", done: false }
console.log(it.next()); // { value: "神话", done: false }
console.log(it.next()); // {value: undefined, done: true }
```

我们还可以自定义一个可迭代对象：

```
const myIterable = {};
myIterable[Symbol.iterator] = function*() {
  yield 1;
  yield 2;
  yield 3;
};

for (let value of myIterable) {
  console.log(value);
}
// 1
// 2
// 3

//or

console.log([...myIterable]); // [1, 2, 3]
```

了解了迭代器，下面可以进一步了解生成器了

#### 3. Generator

Generator：生成器对象是生成器函数（GeneratorFunction）返回的，它符合可迭代协议和迭代器协议，既是迭代器也是可迭代对象，可以调用 next 方法，但它不是函数，更不是构造函数

生成器函数（GeneratorFunction）：

```
function* name([param[, param[, ... param]]]) { statements }

name：函数名
param：参数
statements：js 语句
```

调用一个生成器函数并不会马上执行它里面的语句，而是返回一个这个生成器的迭代器对象，当这个迭代器的 next() 方法被首次（后续）调用时，其内的语句会执行到第一个（后续）出现 yield 的位置为止（让执行处于暂停状），yield 后紧跟迭代器要返回的值。或者如果用的是 yield\*（多了个星号），则表示将执行权移交给另一个生成器函数（当前生成器暂停执行），调用 next() （再启动）方法时，如果传入了参数，那么这个参数会作为上一条执行的 yield 语句的返回值，例如：

```
function* another() {
  yield '人月神话';
}
function* gen() {
  yield* another(); // 移交执行权
  const a = yield 'hello';
  const b = yield a; // a='world' 是 next('world') 传参赋值给了上一个 yidle 'hello' 的左值
  yield b; // b=！ 是 next('！') 传参赋值给了上一个 yidle a 的左值
}
const g = gen();
g.next(); // {value: "人月神话", done: false}
g.next(); // {value: "hello", done: false}
g.next('world'); // {value: "world", done: false} 将 'world' 赋给上一条 yield 'hello' 的左值，即执行 a='world'，
g.next('!'); // {value: "!", done: false} 将 '!' 赋给上一条 yield a 的左值，即执行 b='!'，返回 b
g.next(); // {value: undefined, done: false}
```

我们来总结一下 Generator 的本质，暂停，它会让程序执行到指定位置先暂停（yield），然后再启动（next），再暂停（yield），再启动（next），而这个暂停就很容易让它和异步操作产生联系，因为我们在处理异步时：开始异步处理（网络求情、IO 操作），然后暂停一下，等处理完了，再该干嘛干嘛。不过值得注意的是，js 是单线程的（又重复了三遍），异步还是异步，callback 还是 callback，不会因为 Generator 而有任何改变

下面来看看，用 Generator 实现异步：

```
const promisify = require('util').promisify;
const path = require('path');
const fs = require('fs');
const readFile = promisify(fs.readFile);

const gen = function*() {
  const res1 = yield readFile(path.resolve(__dirname, '../data/a.json'), { encoding: 'utf8' });
  console.log(res1);
  const res2 = yield readFile(path.resolve(__dirname, '../data/b.json'), { encoding: 'utf8' });
  console.log(res2);
};

const g = gen();

const g1 = g.next();
console.log('g1:', g1);

g1.value
  .then(res1 => {
    console.log('res1:', res1);
    const g2 = g.next(res1);
    console.log('g2:', g2);
    g2.value
      .then(res2 => {
        console.log('res2:', res2);
        g.next(res2);
      })
      .catch(err2 => {
        console.log(err2);
      });
  })
  .catch(err1 => {
    console.log(err1);
  });
// g1: { value: Promise { <pending> }, done: false }
// res1: {
//   "a": 1
// }

// {
//   "a": 1
// }

// g2: { value: Promise { <pending> }, done: false }
// res2: {
//   "b": 2
// }

// {
//   "b": 2
// }
```

以上代码是 Generator 和 callback 结合实现的异步，可以看到，仍然需要手动执行 .then 层层添加回调，但由于 next() 方法返回对象 {value: xxx,done: true/false} 所以我们可以简化它，写一个自动执行器：

```
const promisify = require('util').promisify;
const path = require('path');
const fs = require('fs');
const readFile = promisify(fs.readFile);

function run(gen) {
  const g = gen();
  function next(data) {
    const res = g.next(data);
    // 深度递归，只要 `Generator` 函数还没执行到最后一步，`next` 函数就调用自身
    if (res.done) return res.value;
    res.value.then(function(data) {
      next(data);
    });
  }
  next();
}
run(function*() {
  const res1 = yield readFile(path.resolve(__dirname, '../data/a.json'), { encoding: 'utf8' });
  console.log(res1);
  // {
  //   "a": 1
  // }
  const res2 = yield readFile(path.resolve(__dirname, '../data/b.json'), { encoding: 'utf8' });
  console.log(res2);
  // {
  //   "b": 2
  // }
});
```

#### 4.Async/Await

首先，async/await 是 Generator 的语法糖，上面我是分割线下的第一句已经讲过，先来看一下二者的对比：

```
// Generator
run(function*() {
  const res1 = yield readFile(path.resolve(__dirname, '../data/a.json'), { encoding: 'utf8' });
  console.log(res1);
  const res2 = yield readFile(path.resolve(__dirname, '../data/b.json'), { encoding: 'utf8' });
  console.log(res2);
});

// async/await
const readFile = async ()=>{
  const res1 = await readFile(path.resolve(__dirname, '../data/a.json'), { encoding: 'utf8' });
  console.log(res1);
  const res2 = await readFile(path.resolve(__dirname, '../data/b.json'), { encoding: 'utf8' });
  console.log(res2);
  return 'done'；
}
const res = readFile();
```

可以看到，async function 代替了 function\*，await 代替了 yield，同时也无需自己手写一个自动执行器 run 了

现在再来看看 async/await 的特点：

- 当 await 后面跟的是 Promise 对象时，才会异步执行，其它类型的数据会同步执行
- 执行 const res = readFile(); 返回的仍然是个 Promise 对象，上面代码中的 return 'done'; 会直接被下面 then 函数接收到

```
res.then(data => {
  console.log(data); // done
});
```
