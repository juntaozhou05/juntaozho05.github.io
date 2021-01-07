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

2.跳水板

你正在使用一堆木板建造跳水板。有两种类型的木板，其中长度较短的木板长度为shorter，长度较长的木板长度为longer。你必须正好使用k块木板。编写一个方法，生成跳水板所有可能的长度。

返回的长度需要从小到大排列。

思路：长短若相同，直接返回积，长板一次乘，短板补余量

解答：
```
var divingBoard = function(shorter, longer, k) {
    if(k === 0) return [];

    if(longer === shorter) {
        return [longer * k];
    }
    let ans = []
    for(let i = 0; i <= k; i++) {
        let rest = k - i;
        ans[i] = longer * i + shorter * rest;
    }
    return ans;
};
```

3.合并二维有序数组成一维有序数组，归并排序的思路

思路：双指针 从头到尾比较 两个数组的第一个值，根据值的大小依次插入到新的数组中

解答：
```
function　merge(arr1, arr2){
    var　result=[];
    while(arr1.length>0 && arr2.length>0){
        if(arr1[0]<arr2[0]){
              /*shift()方法用于把数组的第一个元素从其中删除，并返回第一个元素的值。*/
            result.push(arr1.shift());
        }else{
            result.push(arr2.shift());
        }
    }
    return　result.concat(arr1).concat(arr2);
}

function mergeSort(arr){
    let lengthArr = arr.length;
    if(lengthArr === 0){
     return [];
    }
    while(arr.length > 1){
     let arrayItem1 = arr.shift();
     let arrayItem2 = arr.shift();
     let mergeArr = merge(arrayItem1, arrayItem2);
     arr.push(mergeArr);
    }
    return arr[0];
}
let arr1 = [[1,2,3],[4,5,6],[7,8,9],[1,2,3],[4,5,6]];
let arr2 = [[1,4,6],[7,8,10],[2,6,9],[3,7,13],[1,5,12]];
mergeSort(arr1);
mergeSort(arr2);
```

4.二分查找

给定一个 n 个元素有序的（升序）整型数组 nums 和一个目标值 target  ，写一个函数搜索 nums 中的 target，如果目标值存在返回下标，否则返回 -1。

示例 1:

输入: nums = [-1,0,3,5,9,12], target = 9
输出: 4
解释: 9 出现在 nums 中并且下标为 4
示例 2:

输入: nums = [-1,0,3,5,9,12], target = 2
输出: -1
解释: 2 不存在 nums 中因此返回 -1

思路：
二分查找是个很经典的算法了，它的一个典型的特点就是“思路容易，细节非常易错”。

这里就主要讲讲代码里的细节吧：

首先，为什么是 while (left <= right) 而不是 while (left < right)？
这是因为要考虑到 left 和 right 相等的情况，也就是查找区间里只有一个值。

为什么 left = mid + 1，这个 +1 是什么？
这是因为 mid 位置的值已经查找过了，可以往右边跳一位。

什么情况 left 会超出 right？如果二分查找到的值一直小于目标值，left会不断右移，直到最后数组区间里只有一个值，如果此时这个目标值还是大于这个值，left 会继续加一，此时 left 会超过 right。

反之，则 right 会超出 left。

解答：
```
function search(arr, target) {
  let left = 0;
  let right = arr.length - 1;

  while(left <= right) {
    let mid = Math.round((right + left) / 2);
    if(arr[mid] === target) {
      return mid;
    }
    if(arr[mid] < target) {
      return mid + 1;
    }
    if(arr[mid] > target) {
      return mid - 1;
    }
  }
}
```

5.x 的平方根
实现 int sqrt(int x) 函数。

计算并返回 x 的平方根，其中 x 是非负整数。

由于返回类型是整数，结果只保留整数的部分，小数部分将被舍去。

示例 1:

输入: 4
输出: 2
示例 2:

输入: 8
输出: 2
说明: 8 的平方根是 2.82842...,
由于返回类型是整数，小数部分将被舍去。

思路：
本题利用二分查找来求解，一开始把右边界粗略的设定为目标值 x，左右边界的中间值设为 mid，然后在二分过程中每次发现 mid * mid < x 的情况，就把这个 mid 值记录为 ans。

如果计算出的乘积正好等于 x，就直接返回这个 mid 值。

如果二分查找超出边界了，无论最后的边界是停留在小于 x 的位置还是大于 x 的位置，都返回 ans 即可，因为它是最后一个乘积小于 x 的值，一定是正确答案。

解答：
```
let mySqrt = function (x) {
  let left = 0;
  let right = x;
  let ans = 0;
  while(left <= right) {
    let mid = Math.round((left + right) / 2);
    let product = mid * mid;
    if(product <= x) {
      ans = mid;
      left = mid + 1;
    }else if(product > x) {
      right = mid - 1;
    }else {
      return mid;
    }
  }
  return ans
};
```

6.Pow(x, n)
实现 pow(x, n) ，即计算 x 的 n 次幂函数。

思路：
把 x 的 n 次方转化为 x * x 的 n / 2 次方。

比如求 2 的 10 次方可以转为 4 的 5 次方，这时候遇到奇数次方了，就转化为 4* (4 的 4 次方)。

然后对于 4 的 4 次方，再进一步转化为 16 的 2 次方，最后转为 256 的 1 次方 * 4，就得出最终解 1024。

解答：
```
var myPow = function (x, n) {
  if (n === 0) return 1;
  if (n === 1) return x;
  let abs = Math.abs(n);
  let isMinus = abs !== n;

  let res = abs % 2 === 0 ? myPow(x * x, abs / 2) : x * myPow(x, abs - 1);
  return isMinus ? 1 / res : res;
};
```

7.长度最小的子数组
给定一个含有 n 个正整数的数组和一个正整数 s ，找出该数组中满足其和 ≥ s 的长度最小的连续子数组，并返回其长度。如果不存在符合条件的连续子数组，返回 0。

示例:

输入: s = 7, nums = [2,3,1,2,4,3]
输出: 2
解释: 子数组 [4,3] 是该条件下的长度最小的连续子数组。

思路：
定义两个下标 i、j 为左右边界，中间的子数组为滑动窗口。在更新窗口的过程中不断的更新窗口之间的值的和 sum。

当 sum < 目标值，说明值不够大，j++，右边界右移。
当 sum >= 目标值，满足条件，把当前窗口的大小和记录的最小值进行对比，更新最小值。并且 i++ 左窗口右移，继续找最优解。
当 i 超出了数组的右边界，循环终止。

解答：
```
let minSubArrayLen = function (s, nums) {
  let n = nums.length;

  let i = 0;
  let j = -1;

  let sum = 0;
  let res = Infinity;

  while(i < n) {
    if (sum < s) {
      sum += nums[++j];
    }else {
      sum -= nums[i];
      i++;
    }
    if(sum >= s) {
      res = Math.min(res, j - i + 1)
    }
  }
  return res === Infinity ? 0 : res;
}
```

8.给定一个字符串，请你找出其中不含有重复字符的   最长子串   的长度。

示例  1:

输入: "abcabcbb"
输出: 3
解释: 因为无重复字符的最长子串是 "abc"，所以其长度为 3。
示例 2:

输入: "bbbbb"
输出: 1
解释: 因为无重复字符的最长子串是 "b"，所以其长度为 1。
示例 3:

输入: "pwwkew"
输出: 3
解释: 因为无重复字符的最长子串是 "wke"，所以其长度为 3。
     请注意，你的答案必须是 子串 的长度，"pwke" 是一个子序列，不是子串。


思路：
这题是比较典型的滑动窗口问题，定义一个左边界 left 和一个右边界 right，形成一个窗口，并且在这个窗口中保证不出现重复的字符串。

这需要用到一个新的变量 freqMap，用来记录窗口中的字母出现的频率数。在此基础上，先尝试取窗口的右边界再右边一个位置的值，也就是 str[right + 1]，然后拿这个值去 freqMap 中查找：

这个值没有出现过，那就直接把 right ++，扩大窗口右边界。
如果这个值出现过，那么把 left ++，缩进左边界，并且记得把 str[left] 位置的值在 freqMap 中减掉。
循环条件是 left < str.length，允许左边界一直滑动到字符串的右界。

解答：
```
let lengthOfLongestSubstring = function (str) {
  let n = str.length
  // 滑动窗口为s[left...right]
  let left = 0
  let right = -1
  let freqMap = {} // 记录当前子串中下标对应的出现频率
  let max = 0 // 找到的满足条件子串的最长长度

  while (left < n) {
    let nextLetter = str[right + 1]
    if (!freqMap[nextLetter] && nextLetter !== undefined) {
      freqMap[nextLetter] = 1
      right++
    } else {
      freqMap[str[left]] = 0
      left++
    }
    max = Math.max(max, right - left + 1)
  }

  return max
}
```

9.移动零
给定一个数组 nums，编写一个函数将所有 0 移动到数组的末尾，同时保持非零元素的相对顺序。

示例:

输入: [0,1,0,3,12]
输出: [1,3,12,0,0]
说明:

必须在原数组上操作，不能拷贝额外的数组。尽量减少操作次数。

思路：
慢指针 j 从 0 开始，当快指针 i 遍历到非 0 元素的时候，i 和 j 位置的元素交换,然
后把 j + 1。

也就是说，快指针 i 遍历完毕后, [0, j) 区间就存放着所有非 0 元素，而剩余的[j,
n]区间再遍历一次，用 0 填充满即可。

解答：
```
var moveZeroes = function (nums) {
  let j = 0;
  for(let i = 0; i < nums.length; i++) {
    if(nums[i] !== 0) {
      nums[j] = nums[i];
      j++;
    }
  }
  while(j < nums.length) {
    nums[j] = 0;
    j++;
  }
  return nums;
}
```

10.合并两个有序数组

给你两个有序整数数组 nums1 和 nums2，请你将 nums2 合并到 nums1 中，使 nums1 成为一个有序数组。

说明:

初始化 nums1 和 nums2 的元素数量分别为 m 和 n 。
你可以假设 nums1 有足够的空间（空间大小大于或等于 m + n）来保存 nums2 中的元素。

示例:

输入:

nums1 = [1,2,3,0,0,0], m = 3
nums2 = [2,5,6],       n = 3

输出: [1,2,2,3,5,6]

思路：
从后往前的双指针思路，先定义指针 i 和 j 分别指向数组中有值的位置的末尾，再定义指针 k 指向待填充的数组 1 的末尾。

然后不断的迭代 i 和 j 指针，如果 i 位置的值比 j 大，就移动 i 位置的值到 k 位置，反之亦然。

如果 i 指针循环完了，j 指针的数组里还有值未处理的话，直接从 k 位置开始向前填充 j 指针数组即可。因为此时数组 1 原本的值一定全部被填充到了数组 1 的后面位置，且这些值一定全部大于此时 j 指针数组里的值。

解答：
```
let merge = function (arr1, m, arr2, n) {
  let i = m - 1;
  let j = m - 1;
  let k = arr1.length - 1;

  while (i >= 0 && j>= 0) {
    let num1 = arr1[i];
    let num2 = arr2[j];
    if(num1 > num2) {
      arr1[k] = num1;
      i--;
    } else {
      arr1[k] = num2;
      j--;
    }
    k--;
  }
  while(j >= 0) {
    arr1[k] = arr2[j];
    j--;
    k--;
  }
  return arr1;
}
```


































