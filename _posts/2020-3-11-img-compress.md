---
layout: post
title: "js图片压缩"
subtitle: ""
author: "ZJT"
header-style: text
tags:
  - js
---

### 基本步骤

- 通过原生的input标签拿到要上传的图片文件
- 将图片文件转化成img元素标签
- 在canvas上压缩绘制该HTMLImageElement
- 将canvas绘制的图像转成blob文件
- 最后将该blob转换为图片预览

#### 1.读取文件转成img标签元素

```
// 先new一个img和fileReader的实例
const img = new Image()
const reader = new FileReader()// 读取文件资源
reader.readAsDataURL(file[0]) 
reader.onload = function(e){ 
 img.src = e.target.result
}
```

#### 2.canvas压缩，核心步骤
拿到转化后的img元素后，先取出该元素的宽高度，这个宽高度就是实际图片文件的宽高度。
```
const { width: originWidth, height: originHeight } = img
```
然后定义一个最大限度的宽高度，如果超过这个限制宽高度，则进行等比例的缩放
```
// 最大尺寸限制
const maxWidth = 1000,maxHeihgt = 1000
// 需要压缩的目标尺寸
let targetWidth = originWidth, targetHeight = originHeight
// 等比例计算超过最大限制时缩放后的图片尺寸
if (originWidth > maxWidth || originHeight > maxHeight) {
  if (originWidth / originHeight > 1) {
   // 宽图片
   targetWidth = maxWidth
   targetHeight = Math.round(maxWidth * (originHeight / originWidth))
  } else {
   // 高图片
   targetHeight = maxHeight
   targetWidth = Math.round(maxHeight * (originWidth / originHeight))
  }
 }
```
计算好将要压缩的尺寸后，创建canvas实例，设置canvas的宽高度为压缩计算后的尺寸，并将img绘制到上面
```
// 创建画布
const canvas = document.createElement('canvas')
const context = canvas.getContext('2d')
 
// 设置宽高度为等同于要压缩图片的尺寸
 canvas.width = targetWidth
 canvas.height = targetHeight
 context.clearRect(0, 0, targetWidth, targetHeight)
 //将img绘制到画布上
 context.drawImage(img, 0, 0, targetWidth, targetHeight)
```
#### 3.转成blob文件
canvas绘制完成后，就可以使用 toBlob来将图像转成blob文件了，这个api接受三个入参
回调函数中可以得到转化后的blob文件，type为要转成的图片类型，默认png。
encoderOptions为当设置的图片格式为 image/jpeg 或者 image/webp 时用来指定图片展示质量。
所以如果我们只是要压缩jpg或者webp格式的图片的话，不需要进行第3部的操作，直接使用这个api，然后填入想要的质量参数就可以了。但实际上，我们还是要考虑多种的图片格式，因此很有必要使用第三部的过程。

#### 4.blob预览
```
document.getElementById("img").src = window.URL.createObjectURL(blob);
```

### 完整代码
```
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Document</title>
  </head>

  <body>
    <input id="input" type="file" accept="image/*" />
    <img id="img" src="" alt="" />
  </body>
  <script>
    // 压缩前将file转换成img对象
    function readImg(file) {
      return new Promise((resolve, reject) => {
        const img = new Image();
        const reader = new FileReader();
        console.log(file);
        reader.onload = function (e) {
          img.src = e.target.result;
        };
        reader.onerror = function (e) {
          reject(e);
        };
        reader.readAsDataURL(file[0]);
        img.onload = function () {
          resolve(img);
        };
        img.onerror = function (e) {
          reject(e);
        };
      });
    }
    /**
     * 压缩图片
     *@param img 被压缩的img对象
     * @param type 压缩后转换的文件类型
     * @param mx 触发压缩的图片最大宽度限制
     * @param mh 触发压缩的图片最大高度限制
     */
    function compressImg(img, type, mx, mh) {
      return new Promise((resolve, reject) => {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        const { width: originWidth, height: originHeight } = img;
        // 最大尺寸限制
        const maxWidth = mx;
        const maxHeight = mh;
        // 目标尺寸
        let targetWidth = originWidth;
        let targetHeight = originHeight;
        if (originWidth > maxWidth || originHeight > maxHeight) {
          if (originWidth / originHeight > 1) {
            // 宽图片
            targetWidth = maxWidth;
            targetHeight = Math.round(maxWidth * (originHeight / originWidth));
          } else {
            // 高图片
            targetHeight = maxHeight;
            targetWidth = Math.round(maxHeight * (originWidth / originHeight));
          }
        }
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        context.clearRect(0, 0, targetWidth, targetHeight);
        // 图片绘制
        context.drawImage(img, 0, 0, targetWidth, targetHeight);
        canvas.toBlob(function (blob) {
          resolve(blob);
        }, type || "image/png");
      });
    }

    async function upload(file) {
      const img = await readImg(file);
      const blob = await compressImg(img, file.type, 500, 500);
      console.log(blob);
      document.getElementById("img").src = window.URL.createObjectURL(blob);
    }

    document.getElementById("input").onchange = function (e) {
      upload(e.target.files);
    };
  </script>
</html>
```








