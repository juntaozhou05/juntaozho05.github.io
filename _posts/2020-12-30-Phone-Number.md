---
layout: post
title: "电话号码的字母组合"
subtitle: ""
author: "ZJT"
header-style: text
tags:
  - js
---

给定一个仅包含数字 2-9 的字符串，返回所有它能表示的字母组合。

给出数字到字母的映射与电话按键相同。注意 1 不对应任何字母。

思路：维护一个队列。起初让空字符串入列，让当前层的字符串逐个出列，出列的字符串，会构建它下一层的新字母串，并入列。  
一层层地，考察到数字串的最末位，就到了最底一层，此时队列中存的是所有构建完毕的字母串，返回 queue 即可。  
这里控制了层序遍历的深度，为 digits 的长度，而不是while(queue.length){..那样让所有的节点入列出列，最后还会剩下最后一层节点，留在 queue 中返回。  

解答：
```
/**
 * @param {number} m
 * @param {number} n
 * @return {number}
 */
const letterCombinations = (digits) => {
    if(digits.length === 0) return 0
    const map = { '2': 'abc', '3': 'def', '4': 'ghi', '5': 'jkl', '6': 'mno', '7': 'pqrs', '8': 'tuv', '9': 'wxyz' };

    const result = ['']
    for(let i = 0; i < digits.length; i++) {
        const levelSize = result.length;
        for(let j = 0; j < levelSize; j++) {
            const curStr = result.shift()
            const letters = map[digits[i]]
            for(let l of letters) {
                result.push(curStr + l)
            }
        }
    }
    return result
}
```
