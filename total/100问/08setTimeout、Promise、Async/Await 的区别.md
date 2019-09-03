### setTimeout、Promise、Async/Await 的区别

1. setTimeout
```
console.log('script start')	//1. 打印 script start
setTimeout(function(){
    console.log('settimeout')	// 4. 打印 settimeout
})	// 2. 调用 setTimeout 函数，并定义其完成后执行的回调函数
console.log('script end')	//3. 打印 script start
// 输出顺序：script start->script end->settimeout
```
2. Promise  
Promise本身是同步的立即执行函数， 当在executor中执行resolve或者reject的时候, 此时是异步操作， 会先执行then/catch等，当主栈完成后，才会去调用resolve/reject中存放的方法执行，打印p的时候，是打印的返回结果，一个Promise实例。
```
console.log('script start')
let promise1 = new Promise(function (resolve) {
    console.log('promise1')
    resolve()
    console.log('promise1 end')
}).then(function () {
    console.log('promise2')
})
setTimeout(function(){
    console.log('settimeout')
})
console.log('script end')
// 输出顺序: script start->promise1->promise1 end->script end->promise2->settimeout
```
3. async/await
```
async function async1(){
   console.log('async1 start');
    await async2();
    console.log('async1 end')
}
async function async2(){
    console.log('async2')
}

console.log('script start');
async1();
console.log('script end')

// 输出顺序：script start->async1 start->async2->script end->async1 end
```
async 函数返回一个 Promise 对象，当函数执行的时候，一旦遇到 await 就会先返回，等到触发的异步操作完成，再执行函数体内后面的语句。可以理解为，是让出了线程，跳出了 async 函数体。

举个例子：
```
async function func1() {
    return 1
}

console.log(func1())
```
很显然，func1的运行结果其实就是一个Promise对象。因此我们也可以使用then来处理后续逻辑。
```
func1().then(res => {
    console.log(res);  // 30
})
```
await的含义为等待，也就是 async 函数需要等待await后的函数执行完成并且有了返回结果（Promise对象）之后，才能继续执行下面的代码。await通过返回一个Promise对象来实现同步的效果。

**注：** finally
```
// 1. fulfilled情形

Promise.resolve(1).finally(alert);
// Promise {<resolved>: 1}

f = async ()=>{
  try{
    return 1;
  }finally{
    alert();
  }
};

f();
// Promise {<resolved>: 1}

// 2. rejected情形

Promise.reject(1).finally(alert);
// Promise {<rejected>: 1}

f = async ()=>{
  try{
    throw 1;
  }finally{
    alert();
  }
};

f();
// Promise {<rejected>: 1}

```