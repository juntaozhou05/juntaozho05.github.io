---
layout: post
title: "浏览器reflow和repaint"
subtitle: ""
author: "ZJT"
header-style: text
tags:
  - 浏览器
---

### 浏览器渲染过程

- 浏览器解析 HTML 的源码，然后构造出一个 DOM(学名：文档对象模型)树，这棵树包含了所有的 DOM 结点与其中囊括的文本内容，在 JS 中，我们可以通过 document 中的一些方法(例如：getElementById, getElementsByTagName, querySelector...)拿到 HTML 结点所对应的 DOM，并对其进行一些操作。一般来说，DOM 树是以`<html>`作为根结点。

- 接下来，浏览器开始对 CSS 文件内容进行解析。一般来说，浏览器会先查找内联样式，然后应用 CSS 文件中定义的样式，最后再是应用浏览器默认样式。

- 然后，就是构造渲染树的过程。渲染树与 DOM 树有些类似，但并不完全相同。例如我们定义了一个`<div style="display:none;"></div>`的 DOM，实际上这个结点并不会在渲染树里存在，类似的还有其他的不可见元素。另一方面，DOM 中同一类型的结点可能会存在多个，每个结点实际上都是一个盒子，包括宽度、高度、边框大小、边距等等

- 一旦渲染树构造好了，接下来浏览器会将其绘制出来。

渲染树的根结点囊括了所有的可视元素，它是浏览器窗口的一部分，并且能够进行伸缩调整。一般来说，渲染区域为自浏览器左上角(0,0)起始，终止于右下角(window.innerWidth, window.innerHeight)的矩形部分。

### 重绘（repaint）和回流（reflow）

当第一次打开一个页面时，至少会有一次重绘和回流。之后，如果渲染树发生了变动，那么可能会触发重绘或回流中的一个或二者。

1. 如果渲染树的结点发生了结构性变化，例如宽度、高度或者位置上的变化时，那么会触发 Reflow(回流)的逻辑。我们第一次进入一个页面时便会至少触发一次这个逻辑。
2. 如果渲染树结点发生了非结构性变化，例如背景色等的变化时，那么会触发 Repaint(重绘)的逻辑。

### 触发 Repaint 或 Reflow

我们具体看看哪些操作会导致重绘或回流：

- 增加、删除、修改 DOM 结点
- 使用 display:none;的方式隐藏一个结点会导致 repaint 与 reflow，使用 visibility:hidden;进行 dom 隐藏仅仅导致 repaint(没有结构性变化，仅仅看不见而已)
- 移动 dom 或着该 dom 进行动画
- 添加新的样式，或者修改某个样式
- 用户的一些操作诸如改变浏览器窗口大小，调整字体大小，滚动等等

### 浏览器的处理方式

既然渲染树的 reflow 或 repaint 的代价十分高昂，那么不得不采取一些优化的方式，浏览器对此有一些针对性的举措。一种策略便是延迟。浏览器会将一些变动放在一个队列中，当达到一定规模或者延迟的时间已到，那么会一次将这些变动反应到渲染树中。但是这种策略会有一定的弊端，当我们执行一些脚本时可能会导致浏览器不得不提前让 repaint 或 reflow 进行完毕，例如我们需要获取一些样式信息时，诸如：

offsetTop, offsetLeft, offsetWidth, offsetHeight
scrollTop/Left/Width/Height
clientTop/Left/Width/Height
getComputedStyle(), or currentStyle in IE
为了让 JS 获取到最终的样式，浏览器不得不将缓冲队列里 reflow 或 repaint 过程执行完毕。所以，我们一般需要避免一连串的设置或获取 dom 样式：

### 压缩 repaints 或 reflows

我们有一些策略去尽量消除或减小 reflow/repaint 所带来的负面影响。

- 不要一个一个地去改变结点的样式，而可以通过设置 cssText 一次性将结点样式修改完毕：
- 对多个 dom 进行操作时，我们可以使用一种“离线”方式。“离线”意味着我们我们先在渲染树之外进行操作。

  > 创建一个 documentFragment 去保持住我们要操作的 dom
  > 克隆你需要进行操作的结点，进行操作后再将其与原始结点作交换

- 不要经常去访问计算后的样式，如果可以，可以先将这些信息缓存下来。
- 一般说来，如果对一个使用了绝对布局的 dom 进行操作，并不会导致大量的 reflow，不过绝对布局丧失了许多灵活性，很少有人会使用绝对定位的方式进行主界面的布局。

### 概念

reflow：例如某个子元素样式发生改变，直接影响到了其父元素以及往上追溯很多祖先元素（包括兄弟元素），这个时候浏览器要重新去渲染这个子元素相关联的所有元素的过程称为回流。

reflow：几乎是无法避免的。现在界面上流行的一些效果，比如树状目录的折叠、展开（实质上是元素的显 示与隐藏）等，都将引起浏览器的 reflow。鼠标滑过、点击……只要这些行为引起了页面上某些元素的占位面积、定位方式、边距等属性的变化，都会引起它内部、周围甚至整个页面的重新渲 染。通常我们都无法预估浏览器到底会 reflow 哪一部分的代码，它们都彼此相互影响着。

repaint：如果只是改变某个元素的背景色、文 字颜色、边框颜色等等不影响它周围或内部布局的属性，将只会引起浏览器 repaint（重绘）。repaint 的速度明显快于 reflow

下面情况会导致 reflow 发生

1：改变窗口大小

2：改变文字大小

3：内容的改变，如用户在输入框中敲字

4：激活伪类，如:hover

5：操作 class 属性

6：脚本操作 DOM

7：计算 offsetWidth 和 offsetHeight

8：设置 style 属性

### 减少回流方式

1：不要通过父级来改变子元素样式，最好直接改变子元素样式，改变子元素样式尽可能不要影响父元素和兄弟元素的大小和尺寸

2：尽量通过 class 来设计元素样式，切忌用 style
```
var bstyle = document.body.style; // cache

bstyle.padding = "20px"; // reflow, repaint
bstyle.border = "10px solid red"; // 再一次的 reflow 和 repaint

bstyle.color = "blue"; // repaint
bstyle.backgroundColor = "#fad"; // repaint

bstyle.fontSize = "2em"; // reflow, repaint

// new DOM element - reflow, repaint
document.body.appendChild(document.createTextNode('dude!'));
```
对上面代码优化：
```
.b-class{
　　 padding:20px;
　　 color:blue;
　　 border:10px solid red;
　　 background-color:#fad;
　　 font-size:2em;
}
\$div.addClass("b-class");
```
3：实现元素的动画，对于经常要进行回流的组件，要抽离出来，它的 position 属性应当设为 fixed 或 absolute

4：权衡速度的平滑。比如实现一个动画，以 1 个像素为单位移动这样最平滑，但 reflow 就会过于频繁，CPU 很快就会被完全占用。如果以 3 个像素为单位移动就会好很多。

5：不要用 tables 布局的另一个原因就是 tables 中某个元素一旦触发 reflow 就会导致 table 里所有的其它元素 reflow。在适合用 table 的场合，可以设置 table-layout 为 auto 或 fixed，

6：这样可以让 table 一行一行的渲染，这种做法也是为了限制 reflow 的影响范围。

7：css 里不要有表达式 expression

8：减少不必要的 DOM 层级（DOM depth）。改变 DOM 树中的一级会导致所有层级的改变，上至根部，下至被改变节点的子节点。这导致大量时间耗费在执行 reflow 上面。

9：避免不必要的复杂的 CSS 选择器，尤其是后代选择器（descendant selectors），因为为了匹配选择器将耗费更多的 CPU。

10: 尽量不要过多的频繁的去增加，修改，删除元素，因为这可能会频繁的导致页面 reflow，可以先把该 dom 节点抽离到内存中进行复杂的操作然后再 display 到页面上。

在 div.first 里面加入 div.second,在 div.second 里面加入 div.third:
```
$divS = $("<div class='second'></div>");

$(div.first).append($divS));//reflow

$divT = $("<div class='third'></div>");

$divS.append($divT);//reflow
```

优化代码：
```
$divS = $("<div class='second'></div>");

$divT = $("<div class='third'></div>");

$divS.append($divT);

$(div.first).append($divS));//reflow
```

或者：
```
var $divF = $(div.first);

$divS = $("<div class='second'></div>");

\$divS.hide();

$(div.first).append($divS));

$divT = $("<div class='third'></div>");

$divS.append($divT);

\$divS.show();//reflow
```
11：请求如下值 offsetTop, offsetLeft, offsetWidth, offsetHeight，scrollTop/Left/Width/Height，clientTop/Left/Width/Height，浏览器会发生 reflow，建议将他们合并到一起操作，可以减少回流的次数。

如果我们要经常去获取和操作这些值，则可以先将这些值缓存起来例如：
```
var windowHeight = window.innerHeight;//reflow

for(i=0;i<10;i++){

\$body.height(windowHeight++);

一系列关于 windowHeight 的操作.......

}

```
