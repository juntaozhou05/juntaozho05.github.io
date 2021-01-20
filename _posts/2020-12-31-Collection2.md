---
layout: post
title: "算法总结2"
subtitle: ""
author: "ZJT"
header-style: text
tags:
  - js
---

1.分发饼干
假设你是一位很棒的家长，想要给你的孩子们一些小饼干。但是，每个孩子最多只能给一块饼干。对每个孩子 i ，都有一个胃口值 gi ，这是能让孩子们满足胃口的饼干的最小尺寸；并且每块饼干 j ，都有一个尺寸 sj 。如果 sj >= gi ，我们可以将这个饼干 j 分配给孩子 i ，这个孩子会得到满足。你的目标是尽可能满足越多数量的孩子，并输出这个最大数值。

注意：

你可以假设胃口值为正。
一个小朋友最多只能拥有一块饼干。

示例 1:

输入: [1,2,3], [1,1]

输出: 1

解释: 
你有三个孩子和两块小饼干，3个孩子的胃口值分别是：1,2,3。
虽然你有两块小饼干，由于他们的尺寸都是1，你只能让胃口值是1的孩子满足。
所以你应该输出1。
示例 2:

输入: [1,2], [1,2,3]

输出: 2

解释: 
你有两个孩子和三块小饼干，2个孩子的胃口值分别是1,2。
你拥有的饼干数量和尺寸都足以让所有孩子满足。
所以你应该输出2.

思路：
把饼干和孩子的需求都排序好，然后从最小的饼干分配给需求最小的孩子开始，不断的尝试新的饼干和新的孩子，这样能保证每个分给孩子的饼干都恰到好处的不浪费，又满足需求。

利用双指针不断的更新 i 孩子的需求下标和 j饼干的值，直到两者有其一达到了终点位置：

如果当前的饼干不满足孩子的胃口，那么把 j++ 寻找下一个饼干，不用担心这个饼干被浪费，因为这个饼干更不可能满足下一个孩子（胃口更大）。
如果满足，那么 i++; j++; count++ 记录当前的成功数量，继续寻找下一个孩子和下一个饼干。

解答：
```
let findContentChildren = function (g, s) {
  g.sort((a,b)=>a-b);
  s.sort((a,b)=>a-b);
  let i = 0;
  let j = 0;
  let count = 0;
  while(j < s.length && i < g.length) {
    let need = g[i]
    let cookie = s[j]

    if(cookie >= need) {
      count++;
      i++;
      j++;
    }else {
      j++;
    }
  }
  return count;
}
```

2.买卖股票的最佳时机
给定一个数组，它的第  i 个元素是一支给定股票第 i 天的价格。

设计一个算法来计算你所能获取的最大利润。你可以尽可能地完成更多的交易（多次买卖一支股票）。

注意：你不能同时参与多笔交易（你必须在再次购买前出售掉之前的股票）。

示例 1:

输入: [7,1,5,3,6,4]
输出: 7
解释: 在第 2 天（股票价格 = 1）的时候买入，在第 3 天（股票价格 = 5）的时候卖出, 这笔交易所能获得利润 = 5-1 = 4 。
  随后，在第 4 天（股票价格 = 3）的时候买入，在第 5 天（股票价格 = 6）的时候卖出, 这笔交易所能获得利润 = 6-3 = 3 。
示例 2:

输入: [1,2,3,4,5]
输出: 4
解释: 在第 1 天（股票价格 = 1）的时候买入，在第 5 天 （股票价格 = 5）的时候卖出, 这笔交易所能获得利润 = 5-1 = 4 。
  注意你不能在第 1 天和第 2 天接连购买股票，之后再将它们卖出。
  因为这样属于同时参与了多笔交易，你必须在再次购买前出售掉之前的股票。
示例  3:

输入: [7,6,4,3,1]
输出: 0
解释: 在这种情况下, 没有交易完成, 所以最大利润为 0。

思路:
贪心算法，只要第二天的价格比第一天高，就选择今天买入明天卖出。

解答：
```
let maxProfit = function(prices) {
  let max = 0;
  for (let i = 0; i < prices.length - 1; i++) {
    let current = prices[i];
    let next = prices[i + 1];
    if (current < next) {
      max += next - current;
    }
  }
  return max;
};
```

3.判断子序列
给定字符串 s 和 t ，判断 s 是否为 t 的子序列。

你可以认为 s 和 t 中仅包含英文小写字母。字符串 t 可能会很长（长度 ~= 500,000），而 s 是个短字符串（长度 <=100）。

字符串的一个子序列是原始字符串删除一些（也可以不删除）字符而不改变剩余字符相对位置形成的新字符串。（例如，"ace"是"abcde"的一个子序列，而"aec"不是）。

示例 1:
s = "abc", t = "ahbgdc"

返回 true.

示例 2:
s = "axc", t = "ahbgdc"

返回 false.

思路：
判断字符串 s 是否是字符串 t 的子序列，我们可以建立一个 i 指针指向「当前 s 已经在 t 中成功匹配的字符下标后一位」。之后开始遍历 t 字符串，每当在 t 中发现 i 指针指向的目标字符时，就可以把 i 往后前进一位。

一旦i === t.length ，就代表 t 中的字符串全部按顺序在 s 中找到了，返回 true。
当遍历 s 结束后，就返回 false，因为 i 此时并没有成功走 t 的最后一位。

解答：
```
let isSubsequence = function(s, t) {
  let sl = s.length;
  if(!sl) {
    return true;
  }

  let i = 0;
  for(let j =0; j < t.length; j++) {
    let target = s[i];
    let cur = t[j];
    if(target === cur) {
      i++;
      if(i === sl) {
        return true;
      }
    }
  }
  return false;
}
```

4.颜色分类
给定一个包含红色、白色和蓝色，一共 n 个元素的数组，原地对它们进行排序，使得相同颜色的元素相邻，并按照红色、白色、蓝色顺序排列。

此题中，我们使用整数 0、 1 和 2 分别表示红色、白色和蓝色。

注意:
不能使用代码库中的排序函数来解决这道题。

示例:

输入: [2,0,2,1,1,0]
输出: [0,0,1,1,2,2]

思路：
最简单的思路就是遍历一遍整个数组，统计出其中各个颜色的数量，最后把这个数组重新填充即可。

解答：
```
let sortColors = function(nums) {
  let colors  =[0, 0, 0];
  for(let i = 0; i < nums.length; i++) {
    colors[nums[i]] ++
  }
  nums.length = 0;
  for(let i = 0; i < colors.length; i++) {
    for(let j = 0; j < colors[i]; j++) {
      nums.push(i)
    }
  }
  return nums;
}
```

5.快速排序
三路快排了，顾名思义这种快排就是把数组区分成 < v, ===v, >v 三个区间，然后把等于 v 的区间排除掉，继续对剩余的两个区间进行递归的快速排序。

解答：
```
const quickSort = (arr) => {
  if(arr.length <= 1) return arr;
  let mid = Math.floor(arr.length / 2);
  let target = arr.splice(mid, 1)[0];
  let left = [];
  let right = [];
  for(let i = 0; i < arr.length; i++) {
    if(arr[i] < target) {
      left.push(arr[i]);
    }else {
      right.push(arr[i]);
    }
  }
  return quickSort(left).concat([target], quickSort(right));
}
```

6.通过删除字母匹配到字典里最长单词
给定一个字符串和一个字符串字典，找到字典里面最长的字符串，该字符串可以通过删除给定字符串的某些字符来得到。如果答案不止一个，返回长度最长且字典顺序最小的字符串。如果答案不存在，则返回空字符串。

示例 1:

输入:
s = "abpcplea", d = ["ale","apple","monkey","plea"]

输出:
"apple"
示例 2:

输入:
s = "abpcplea", d = ["a","b","c"]

输出:
"a"
说明:

解答：
```
let findLongestWord = function (s, d) {
  let n = d.length
  let points = Array(n).fill(-1)

  let find = ""
  for (let i = 0; i < s.length; i++) {
    let char = s[i]
    for (let j = 0; j < n; j++) {
      let targetChar = d[j][points[j] + 1]
      if (char === targetChar) {
        points[j]++
        let word = d[j]
        let wl = d[j].length
        if (points[j] === wl - 1) {
          let fl = find.length
          if (wl > fl || (wl === fl && word < find)) {
            find = word
          }
        }
      }
    }
  }

  return find
}
```

7.最长单词
给定一组单词 words，编写一个程序，找出其中的最长单词，且该单词由这组单词中的其他单词组合而成。若有多个长度相同的结果，返回其中字典序最小的一项，若没有符合要求的单词则返回空字符串。

示例：

输入： ["cat","banana","dog","nana","walk","walker","dogwalker"]
输出： "dogwalker"
解释： "dogwalker"可由"dog"和"walker"组成。
提示：

0 <= len(words) <= 100
1 <= len(words[i]) <= 100

思路：
根据题目的要求来看，先把 words 数组按照先比较长度，后比较字典序排列好，把长度最长且字典序最小的字符串先放在前面，然后遍历 words 数组，用当前的单词 word 去和剩下的单词数组利用单词拆分-139的动态规划思路求解是否能拼成，这样可以尽早的返回正确结果。

解答：
```
let wordBreak = function (s, wordDict) {
  let n = s.length
  if (!n) return true

  let wordSet = new Set(wordDict)
  let dp = []
  dp[0] = true

  for (let i = 0; i <= n; i++) {
    for (let j = i; j >= 0; j--) {
      let word = s.slice(j, i)
      if (wordSet.has(word) && dp[j]) {
        dp[i] = true
        break
      }
    }
  }

  return !!dp[n]
}

let longestWord = function (words) {
  // 先长度降序 后字典序升序 排序
  words.sort((a, b) => {
    let diff = b.length - a.length
    if (diff !== 0) {
      return diff
    } else {
      return a < b ? -1 : 1
    }
  })
  words = Array.from(new Set(words))
  for (let i = 0; i < words.length; i++) {
    let word = words[i]
    let rest = words.slice(0, i).concat(words.slice(i + 1))
    if (wordBreak(word, rest)) {
      return word
    }
  }
  return ""
}

```


























