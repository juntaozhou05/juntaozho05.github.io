---
layout: post
title: "server work"
subtitle: ""
author: "ZJT"
header-style: text
tags:
  - js
---

### 浏览器一般有三类 web Worker：

1. Dedicated Worker：专用的 worker，只能被创建它的 JS 访问，创建它的页面关闭，它的生命周期就结束了。
2. Shared Worker：共享的 worker，可以被同一域名下的 JS 访问，关联的页面都关闭时，它的生命周期就结束
3. ServiceWorker：是事件驱动的 worker，生命周期与页面无关，关联页面未关闭时，它也可以退出，没有关联页面时，它也可以启动，

浏览器一般有三类 web Worker：
Dedicated Worker：专用的 worker，只能被创建它的 JS 访问，创建它的页面关闭，它的生命周期就结束了。Shared Worker：共享的 worker，可以被同一域名下的 JS 访问，关联的页面都关闭时，它的生命周期就结束了。ServiceWorker：是事件驱动的 worker，生命周期与页面无关，关联页面未关闭时，它也可以退出，没有关联页面时，它也可以启动，
这三者有什么区别呢？众所周知，JShted 的执行线程，同一时刻内只会有一段代码在执行。Web worker 目的是为 JS 是单线程的，即一个浏览器进程中只有一个 JS 创造多线程环境，允许主线程将一些任务分配给子线程。Web Worker 一般是用于在后台执行一些耗时较长的 JS，避免影响 UI 线程的响应速度。
Dedicated worker 或 shared worker 最主要的能力，一是后台运行 JS，不影响 UI 线程，二是使用消息机制实现并行，可以监听 onmessage 事件。所以 dedicated worker 和 shared worker 专注于解决“耗时的 JS 执行影响 UI 响应”的问题，而 service worker 则是为解决“Web App 的用户体验不如 Native App”的普遍问题而提供的一系列技术集合，必然部分处理逻辑会牵扯到 UI 线程，从而在启动 service worker 的时候，UI 线程的繁忙也会影响其启动性能。

显然 service worker 的使命更加远大，虽然规范把它定义为 web worker，但它已不是一个普通的 worker 了。

### 每一部分的作用

1. 丰富的离线体验
   首先，一提到 service worker，很多人都会想到离线访问，而且不少文章都会提到，service worker 能提供丰富的离线体验，但实际情况来说，需要离线访问的场景很少，毕竟 web 最大的特点在于可传播性，所以 service worker 的离线体验主要还是在于解决页面加载的可靠性，让用户能够完整地打开整个页面，比如页面的白屏时间过长，网络不稳定造成的加载中断导致页面不可用。
   有实际意义的离线，一般不是指断开网络能访问，而是指在用户想访问之前，能提前把资源加载回来。离线并不是一直都断开网络，而是在网络连接良好的情况下，能把需要的资源都加载回来。一些比较糟糕的做法是在 WIFI 网络下把整个 App 客户端的资源都拉下来，这样其实很多资源是用户不需要的，浪费了用户的网络和存储。Service worker 提供了更好更丰富的离线技术，Push / Fetch / Cache 这些技术的结合，能够提供非常完美的离线体验。比如，在小程序页面发版时，推送消息给客户端，客户端唤起页面的 service worker，去将需要用到的资源提前加载回来。

荒凉い 高级会员 | 回帖奖励
这是一个特殊的 worker

浏览器一般有三类 web Worker：
Dedicated Worker：专用的 worker，只能被创建它的 JS 访问，创建它的页面关闭，它的生命周期就结束了。Shared Worker：共享的 worker，可以被同一域名下的 JS 访问，关联的页面都关闭时，它的生命周期就结束了。ServiceWorker：是事件驱动的 worker，生命周期与页面无关，关联页面未关闭时，它也可以退出，没有关联页面时，它也可以启动，
这三者有什么区别呢？众所周知，JShted 的执行线程，同一时刻内只会有一段代码在执行。Web worker 目的是为 JS 是单线程的，即一个浏览器进程中只有一个 JS 创造多线程环境，允许主线程将一些任务分配给子线程。Web Worker 一般是用于在后台执行一些耗时较长的 JS，避免影响 UI 线程的响应速度。
Dedicated worker 或 shared worker 最主要的能力，一是后台运行 JS，不影响 UI 线程，二是使用消息机制实现并行，可以监听 onmessage 事件。所以 dedicated worker 和 shared worker 专注于解决“耗时的 JS 执行影响 UI 响应”的问题，而 service worker 则是为解决“Web App 的用户体验不如 Native App”的普遍问题而提供的一系列技术集合，必然部分处理逻辑会牵扯到 UI 线程，从而在启动 service worker 的时候，UI 线程的繁忙也会影响其启动性能。
显然 service worker 的使命更加远大，虽然规范把它定义为 web worker，但它已不是一个普通的 worker 了。
每一部分的作用

Google 官方入门文档提到，它能提供丰富的离线体验，周期的后台同步，消息推送通知，拦截和处理网络请求，以及管理资源缓存。这每个能力各自都有什么作用呢？

1. 丰富的离线体验
   首先，一提到 service worker，很多人都会想到离线访问，而且不少文章都会提到，service worker 能提供丰富的离线体验，但实际情况来说，需要离线访问的场景很少，毕竟 web 最大的特点在于可传播性，所以 service worker 的离线体验主要还是在于解决页面加载的可靠性，让用户能够完整地打开整个页面，比如页面的白屏时间过长，网络不稳定造成的加载中断导致页面不可用。
   有实际意义的离线，一般不是指断开网络能访问，而是指在用户想访问之前，能提前把资源加载回来。离线并不是一直都断开网络，而是在网络连接良好的情况下，能把需要的资源都加载回来。一些比较糟糕的做法是在 WIFI 网络下把整个 App 客户端的资源都拉下来，这样其实很多资源是用户不需要的，浪费了用户的网络和存储。Service worker 提供了更好更丰富的离线技术，Push / Fetch / Cache 这些技术的结合，能够提供非常完美的离线体验。比如，在小程序页面发版时，推送消息给客户端，客户端唤起页面的 service worker，去将需要用到的资源提前加载回来。
2. 消息推送通知
   Service worker 的消息推送，其实是提供了一种服务器与页面交互的技术。消息推送在 Native App 或 Hybird App 已经比较常见。很多 Hybird App 里面其实还会有一些 H5 页面，在没有实现 service worker 消息推送之前，消息是推送不到页面的。消息能推送到页面，意味着页面提前知道要发生的一些事情，把这些事情做好，比如，提前准备好页面需要的资源。Push 的推送服务器，Chromium 默认使用 GCM / FCM，在国内都不能访问，无法使用。浏览器厂商自己搭建 Push 服务器，成本也不低，目前国内还未有浏览器厂商支持标准的 Push 服务。从 API 的使用规范来看，消息推送与通知弹窗的关联比较密切，基本上使用的业务场景仅限制在消息通知范围。
3. 管理资源缓存
   浏览器提供了很多存储相关的 H5 API，比如 application cache、localStorage，但都不是非常好用，主要是给予页端的控制权太少，限制太多，页端不能完全控制每一个资源请求的存储逻辑，或多或少会有一些趟不过的坑。Service worker Cache API 的出现彻底改变了这一局面，赋予了页端强大的灵活性，更大的存储空间。如何灵活地控制缓存，可以参考 Google 官方文章 《The Offline Cookbook》。
4. 网络请求
   在 Fetch 出现之前，页面 JS 一般通过 XHR 发起网络资源请求，但 XHR 有一定的局限性，比如，它不像普通请求那样支持 Request 和 Response 对象，也不支持 streaming response，一些跨域的场景也限制较多。而现在，Fetch API 支持 Request 和 Response 对象，也支持 streaming response，Foreign Fetch 还具备跨域的能力。
   一般来说，基于 webview 的客户端拦截网络请求，都会基于 WebViewClient 的标准的 shouldInterceptRequest 接口。那么 service worker 的请求在 webview 还能不能拦截呢？WebViewClient 的标准的 shouldInterceptRequest 接口是拦截不了 service worker 的请求了，但 Chrome 49.0 提供了新的 ServiceWorkerController 可以拦截所有 service worker 的请求。另外，页端 JS 可以监听 Fetch 事件，通过 FetchEvent.respondWith 返回符合期望的 Response，即页端也能拦截 Response。
   尴尬的处境
   Service worker 的理想看起来很美好，现实却很骨感，为什么这么说呢？GCM / FCM 服务被墙不说，强大的 Background Sync 功能也需要依赖 Google Play，而国内 Android 手机厂商自带的 ROM 基本上都把 Google Play 干掉了，并且还被墙了，略尴尬。比这更尴尬的是，Apple iOS 团队对 Service Worker 的态度很不明朗，现在是，将来可能也是，所以现在很多特性在 iOS 上都不支持。

### server work 使用

主线程中的状态和 ServiceWorker 子线程中的状态。子线程中的代码处在一个单独的模块中，当我们需要使用 ServiceWorker 时，按照如下的方式来加载：

```
if (navigator.serviceWorker != null) {
  // 使用浏览器特定方法注册一个新的service worker
  navigator.serviceWorker.register('sw.js')
  .then(function(registration) {
    window.registration = registration;
    console.log('Registered events at scope: ', registration.scope);
  });
}
```

这个时候 ServiceWorker 处于 Parsed 解析阶段。当解析完成后 ServiceWorker 处于 Installing 安装阶段，主线程的 registration 的 installing 属性代表正在安装的 ServiceWorker 实例，同时子线程中会触发 install 事件，并在 install 事件中指定缓存资源

```
var cacheStorageKey = 'minimal-pwa-3';

var cacheList = [
  '/',
  "index.html",
  "main.css",
  "e.png",
  "pwa-fonts.png"
]

// 当浏览器解析完sw文件时，serviceworker内部触发install事件
self.addEventListener('install', function(e) {
  console.log('Cache event!')
  // 打开一个缓存空间，将相关需要缓存的资源添加到缓存里面
  e.waitUntil(
    caches.open(cacheStorageKey).then(function(cache) {
      console.log('Adding to Cache:', cacheList)
      return cache.addAll(cacheList)
    })
  )
})
```

这里使用了 Cache API 来将资源缓存起来，同时使用 e.waitUntil 接手一个 Promise 来等待资源缓存成功，等到这个 Promise 状态成功后，ServiceWorker 进入 installed 状态，意味着安装完毕。这时候主线程中返回的 registration.waiting 属性代表进入 installed 状态的 ServiceWorker。

```
/* In main.js */
navigator.serviceWorker.register('./sw.js').then(function(registration) {
    if (registration.waiting) {
        // Service Worker is Waiting
    }
})
```

然而这个时候并不意味着这个 ServiceWorker 会立马进入下一个阶段，除非之前没有新的 ServiceWorker 实例，如果之前已有 ServiceWorker，这个版本只是对 ServiceWorker 进行了更新，那么需要满足如下任意一个条件，新的 ServiceWorker 才会进入下一个阶段：

- 在新的 ServiceWorker 线程代码里，使用了 self.skipWaiting()
- 或者当用户导航到别的网页，因此释放了旧的 ServiceWorker 时候
- 或者指定的时间过去后，释放了之前的 ServiceWorker

这个时候 ServiceWorker 的生命周期进入 Activating 阶段，ServiceWorker 子线程接收到 activate 事件：

```
// 如果当前浏览器没有激活的service worker或者已经激活的worker被解雇，
// 新的service worker进入active事件
self.addEventListener('activate', function(e) {
  console.log('Activate event');
  console.log('Promise all', Promise, Promise.all);
  // active事件中通常做一些过期资源释放的工作
  var cacheDeletePromises = caches.keys().then(cacheNames => {
    console.log('cacheNames', cacheNames, cacheNames.map);
    return Promise.all(cacheNames.map(name => {
      if (name !== cacheStorageKey) { // 如果资源的key与当前需要缓存的key不同则释放资源
        console.log('caches.delete', caches.delete);
        var deletePromise = caches.delete(name);
        console.log('cache delete result: ', deletePromise);
        return deletePromise;
      } else {
        return Promise.resolve();
      }
    }));
  });

  console.log('cacheDeletePromises: ', cacheDeletePromises);
  e.waitUntil(
    Promise.all([cacheDeletePromises]
    )
  )
})
```

这个时候通常做一些缓存清理工作，当 e.waitUntil 接收的 Promise 进入成功状态后，ServiceWorker 的生命周期则进入 activated 状态。这个时候主线程中的 registration 的 active 属性代表进入 activated 状态的 ServiceWorker 实例

```
/* In main.js */
navigator.serviceWorker.register('./sw.js').then(function(registration) {
    if (registration.active) {
        // Service Worker is Active
    }
})
```

到此一个 ServiceWorker 正式进入激活状态，可以拦截网络请求了。如果主线程有 fetch 方式请求资源，那么就可以在 ServiceWorker 代码中触发 fetch 事件：

```
fetch('./data.json')
```

这时在子线程就会触发 fetch 事件：

```
self.addEventListener('fetch', function(e) {
  console.log('Fetch event ' + cacheStorageKey + ' :', e.request.url);
  e.respondWith( // 首先判断缓存当中是否已有相同资源
    caches.match(e.request).then(function(response) {
      if (response != null) { // 如果缓存中已有资源则直接使用
        // 否则使用fetch API请求新的资源
        console.log('Using cache for:', e.request.url)
        return response
      }
      console.log('Fallback to fetch:', e.request.url)
      return fetch(e.request.url);
    })
  )
})
```

那么如果在 install 或者 active 事件中失败，ServiceWorker 则会直接进入 Redundant 状态，浏览器会释放资源销毁 ServiceWorker。

现在如果没有网络进入离线状态，或者资源命中缓存那么就会优先读取缓存的资源：

### 缓存资源更新

那么如果我们在新版本中更新了 ServiceWorker 子线程代码，当访问网站页面时浏览器获取了新的文件，逐字节比对 /sw.js 文件发现不同时它会认为有更新启动 更新算法 open_in_new，于是会安装新的文件并触发 install 事件。但是此时已经处于激活状态的旧的 Service Worker 还在运行，新的 Service Worker 完成安装后会进入 waiting 状态。直到所有已打开的页面都关闭，旧的 Service Worker 自动停止，新的 Service Worker 才会在接下来重新打开的页面里生效。如果想要立即更新需要在新的代码中做一些处理。首先在 install 事件中调用 self.skipWaiting()方法，然后在 active 事件中调用 self.clients.claim()方法通知各个客户端。

注意这里说的是浏览器获取了新版本的 ServiceWorker 代码，如果浏览器本身对 sw.js 进行缓存的话，也不会得到最新代码，所以对 sw 文件最好配置成 cache-control: no-cache 或者添加 md5。

实际过程中像我们刚才把 index.html 也放到了缓存中，而在我们的 fetch 事件中，如果缓存命中那么直接从缓存中取，这就会导致即使我们的 index 页面有更新，浏览器获取到的永远也是都是之前的 ServiceWorker 缓存的 index 页面，所以有些 ServiceWorker 框架支持我们配置资源更新策略，比如我们可以对主页这种做策略，首先使用网络请求获取资源，如果获取到资源就使用新资源，同时更新缓存，如果没有获取到则使用缓存中的资源。
