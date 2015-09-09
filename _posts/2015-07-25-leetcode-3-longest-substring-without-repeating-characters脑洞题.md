---
layout: post
title: LeetCode 3 （脑洞题）
categories: ['coding']
tags: ['algorithm']
published: True
img: 19

---

题意是给定一个字符串，返回不含重复字符的最长串长度

例如对于`abcabcbb`，返回`3`

用`ansl`记录当前选定串的最左字符位置，用`ansr`记录当前选定串的最右字符位置

我的做法是用`map`记录当前选定串中字符的位置，那么当遇到一个新的字符`ch`时，如果`map[ch]`的值不为0，说明当前选定串有`ch`，那就更新当前选定串

每次更新`ansl`和`ansr`时，若两者差值大于当前答案`res`，则更新res

这里所说的`ansr`就是当前字符的下标`i`

代码如下：

```CPP
class Solution {
    public:
        int lengthOfLongestSubstring(string s) {

            if(s.size() == 0) return 0;

            int ansl, res;
            ansl = res = 0;
            map<char, int> mp;

            s = " " + s;
            for(int i=1; i<s.size(); ++i) {
                if(mp[s[i]] != 0) {
                    ansl = max(ansl, mp[s[i]]+1);//保证左侧位置不会“回头”
                }

                if(ansl == 0) res = max(res, i-ansl);
                else res = max(res, i-ansl+1);

                mp[s[i]] = i;
            }
            return res;
        }
};
```
