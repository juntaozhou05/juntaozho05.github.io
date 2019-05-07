---
layout: post
title: "Service Worker"
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

这三者有什么区别呢？众所周知，JShted 的执行线程，同一时刻内只会有一段代码在执行。Web worker 目的是为 JS 是单线程的，即一个浏览器进程中只有一个 JS 创造多线程环境，允许主线程将一些任务分配给子线程。Web Worker 一般是用于在后台执行一些耗时较长的 JS，避免影响 UI 线程的响应速度。
Dedicated worker 或 shared worker 最主要的能力，一是后台运行 JS，不影响 UI 线程，二是使用消息机制实现并行，可以监听 onmessage 事件。所以 dedicated worker 和 shared worker 专注于解决“耗时的 JS 执行影响 UI 响应”的问题，而 service worker 则是为解决“Web App 的用户体验不如 Native App”的普遍问题而提供的一系列技术集合，必然部分处理逻辑会牵扯到 UI 线程，从而在启动 service worker 的时候，UI 线程的繁忙也会影响其启动性能。

显然 service worker 的使命更加远大，虽然规范把它定义为 web worker，但它已不是一个普通的 worker 了。

### 功能和特性

- Service Worker 拥有自己独立的 worker 线程，独立于当前网页线程
- 离线缓存静态资源
- 拦截代理请求和响应
- 可自定义响应内容
- 可以通过 postMessage 向主线程发送消息
- 无法直接操作 DOM
- 必须在 HTTPS 环境下工作或 localhost / 127.0.0.1 （自身安全机制）
- 通过 Promise 异步实现
- Service Worker 安装(installing)完成后，就会一直存在，除非手动卸载(unregister)

### 每一部分的作用

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

1. 检测是否支持 serivceworker

首先，检测当前环境是否支持 service worker,可以使用 'serviceWorker' in navigator 进行检测。

2. 注册

如果支持，可以使用 navigator.serviceWorker.register('./sw.js'),在当前主线程中注册 service worker。如果注册成功，service worker 则在 ServiceWorkerGlobalScope 环境中运行; 需要注意的是: 当前环境无法操作 DOM，且和主线程之间相互独立(即线程之间不会相互阻塞)。

3. 安装

然后，后台开始安装 service worker，一般在此过程中，开始缓存一些静态资源文件。

4. 激活

安装成功之后，准备进行激活 service worker,通常在激活状态下，主要进行缓存清理，更新 service worker 等操作。

5. 使用

激活成功后，,service worker 就可以控制当前页面了。需要注意的是，只有在 service worker 成功激活后，才具有控制页面的能力，一般在第一次访问页面时，service worker 第一次创建成功，并没有激活，只有当刷新页面，再次访问之后，才具有控制页面的能力。

### 源码实现

该源码实现了以下几个功能:

- 强制更新
  通过 self.skipWaiting(),如果检测到新的 service worker 文件，就会立即替换掉旧的。
- 缓存静态资源
  cache.addAll(cacheFiles) 通过这个接口实现
- 拦截请求
  通过监听 fetch 事件，可以拦截当前页所有请求 self.addEventListener('fetch',function(e){})
- 缓存响应
  将响应内容加入缓存 cache.put(evt.request, response)

```
//主线程里添加注册
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/sw.js")
    .then(function(registration) {
      console.log("成功安装", registration.scope);
    })
    .catch(function(err) {
      console.log(err);
    });
}
```

./sw.js 内容

```
// 缓存静态资源文件列表
let cacheFiles = [
  './test.js',
  './index.html',
  './src/img/yy.png'
]
// serviceworker使用版本
let __version__ = 'cache-v2'

// 缓存静态资源
self.addEventListener('install', function (evt) {
  // 强制更新sw.js
  self.skipWaiting()
  evt.waitUntil(
    caches.open(version).then(function (cache) {
      return cache.addAll(cacheFiles)
    })
  )
})

// 缓存更新
self.addEventListener('active', function (evt) {
  evt.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames.map(function (cacheName) {
          if (cacheName !== version) {
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
})

// 请求拦截
self.addEventListener('fetch', function (evt) {
  console.log('处理fetch事件:', evt.request.url)
  evt.respondWith(
    caches.match(evt.request).then(function (response) {
      if (response) {
        console.log('缓存匹配到res:', response)
        return response
      }
      console.log('缓存未匹配对应request,准备从network获取', caches)
      return fetch(evt.request).then(function (response) {
        console.log('fetch获取到的response:', response)
        caches.open(version).then(function (cache) {
          cache.put(evt.request, response)
          return response
        })
      })
    }).catch(function (err) {
      console.error('fetch 接口错误', err)
      throw err
    })
  )
})
```

虽然已实现了离线缓存，但是，使用 Cache Storage 还需要注意以下几点：

1. 它只能缓存 GET 请求；
2. 每个站点只能缓存属于自己域下的请求，同时也能缓存跨域的请求，比如 CDN，不过无法对跨域请求的请求头和内容进行修改,缓存的更新需要自行实现；
3. 缓存不会过期，除非将缓存删除，而浏览器对每个网站 Cache Storage 的大小有硬性的限制，所以需要清理不必要的缓存。

### Service Worker Cache VS Http Cache

对比起 Http Header 缓存，Service Worker 配合 Cache Storage 也有自己的优势：

- 缓存与更新并存：每次更新版本，借助 Service Worker 可以立马使用缓存返回，但与此同时可以发起请求，校验是否有新版本更新。
- 无侵入式：hash 值实在是太难看了。
- 不易被冲掉：Http 缓存容易被冲掉，也容易过期，而 Cache Storage 则不容易被冲掉。也没有过期时间的说法。
- 离线：借助 Service Worker 可以实现离线访问应用。

但是缺点是，由于 Service Worker 依赖于 fetch API、依赖于 Promise、Cache Storage 等，兼容性不太好。
