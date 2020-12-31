---
layout: post
title: "不同路径"
subtitle: ""
author: "ZJT"
header-style: text
tags:
  - js
---

1.有效的括号

给定一个只包括 '('，')'，'{'，'}'，'['，']' 的字符串，判断字符串是否有效。

有效字符串需满足：

左括号必须用相同类型的右括号闭合。
左括号必须以正确的顺序闭合。
注意空字符串可被认为是有效字符串。

示例 1:

输入: "()"
输出: true
示例 2:

输入: "()[]{}"
输出: true
示例 3:

输入: "(]"
输出: false

解答：
```
var isValid = function(s) {
    const mappings = new Map();
    mappings.set('(',')');
    mappings.set('[',']');
    mappings.set('{','}');

    const stack = []
    for(let i = 0; i < s.length; i++) {
        if(mappings.has(s[i])) {
            stack.push(mappings.get(s[i]))
        }else {
            if (stack.pop() !== s[i]) {
                return false;
            }
        }
    }

    if(stack.length !== 0) {
        return false;
    }
    return true
}
```

2.



















