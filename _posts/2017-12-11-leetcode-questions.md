---
layout: post
title: "leetcode-questions"
subtitle: ""
author: "ZJT"
header-style: text
tags:
  - Js
---

1. 给定一个字符串，请你找出其中不含有重复字符的 最长子串 的长度。

```
var lengthOfLongestSubstring = function(s) {
    if (s.length == 0) {
        return 0;
    }
    var sArr = s.split('');
    var resArr = [sArr[0]];
    var res = 1;
    var item;
    for (var i = 0; i < s.length; i++) {
        item = sArr[i];
        var indexOf = resArr.indexOf(item); /*        如果下一个字符包含在目前 的字符串中，就截取已有字符串中，从该字符串后面的。*/
        if (indexOf > -1) {
            resArr = resArr.splice(indexOf + 1);
        }
        resArr.push(item);
        res = resArr.length > res ? resArr.length : res;
    }
    return res;
};
```
