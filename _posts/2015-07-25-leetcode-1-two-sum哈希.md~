---
layout: post
title: LeetCode 1 Two Sum（哈希）
categories: ['coding']
tags: ['yinwoods', 'blog']
published: True
img: 17

---

题意是给出一串数字以及一个target（保证有一解）

找出满足两数之和等于target的两个数的下标（下标从1开始）

一个简单的想法就是直接暴力，时间复杂度`O（n*n）`，超时

然后可以想到对这串数字排序，排序后从两边向中间找

但是有一个很棘手的问题就是这串数字中一对相同的数是答案，比如`[0，3，4，0]`;`target=0`此时答案应该是`1， 4`；找出这对答案要保证不重复找某个数（如输出`1， 1`或`4， 4`）

我的方法是先找到一个数后，在排除这个数后的数字串里寻找另一个数。

代码如下：

```CPP
class Solution {
    public:
        vector<int> twoSum(vector<int>& nums, int target) {
            vector<int> ans;
            vector<int> tmp(nums.begin(), nums.end());
            sort(tmp.begin(), tmp.end());
            int i = 0;
            int j = tmp.size()-1;
            while(i < j) {
                if(tmp[i]+tmp[j] > target) {
                    --j;
                } else if(tmp[i]+tmp[j] < target) {
                    ++i;
                } else {
                    int x = find(nums.begin(), nums.end(), tmp[i])-nums.begin();
                    int y = find(nums.begin()+x+1, nums.end(), tmp[j])-nums.begin();//在后半段内找
                    if(y == nums.size()) {//找不到的情况下在前半段内找
                        y = find(nums.begin(), nums.begin()+x, tmp[j])-nums.begin();
                    }
                    ans.push_back(min(x, y)+1);
                    ans.push_back(x+y-min(x, y)+1);
                    return ans;
                }
            }
        }
};
```

看答案讨论区有一个很好的想法，就是`hash`处理

对当前的`nums[i]`，用`map`保存`<target-nums[i], i+1>`

那么每遇到一个`nums[i]`的时候，就可以考察`map[nums[i]]`是否为0，不为0说明在之前已经出现过`target-nums[i]`，则输出`<map[nums[i]], i+1>`即可

想发很巧妙，但因为使用了map，导致效率不如第一份代码效率高

```CPP
class Solution {
    public:
        vector<int> twoSum(vector<int>& nums, int target) {
            vector<int> ans;
            map<int, int> mp;
            int len = nums.size();

            for(int i=0; i<len; ++i) {
                if(mp[nums[i]] != 0) {
                    ans.push_back(mp[nums[i]]);
                    ans.push_back(i+1);
                    return ans;
                } else {
                    mp[target-nums[i]] =  i+1;
                }
            }
        }
};
```