---
layout: post
title: LeetCode 238（数学）
categories: ['coding']
tags: ['algorithm']
published: True
img: 12

---

题目的意思是给定一个数组，让你输出另一个数组，这个数组中每个元素的值为给定数组中除该位置外剩余所有元素的乘积。

例如输入`[1,2,3,4]`，输出`[24,12,8,6]`

**`要求：不能使用除法，且时间复杂度在O（n）内`**

其实题目中说明了不能使用除法就比较容易想到把`一个数左右两侧的所有数乘起来`

但是题目处理要两次处理，从左至右求每个数  左侧所有数的积  和从右至左求每个数  右侧所有数的积

考虑到题目的  	**` 提高：使用常数空间来完成题目`**，所以可以每次扫描使用一个数来记录该数一侧的乘积

代码如下：

{% highlight cpp %}
class Solution {
	public:
		vector<int> productExceptSelf(vector<int>& nums) {
			vector<int> ans;
			int l = 1, r = 1;

			ans.push_back(1);//第一个数的左侧乘积
			for(int i=1; i<nums.size(); ++i) {
				ans.push_back(l*nums[i-1]);//每个数左侧乘积等于上个数左侧乘积乘以上个数
				l *= nums[i-1];
			}

			for(int i=nums.size()-2; i>=0; --i) {
				ans[i] = ans[i]*r*nums[i+1];//每个数右侧乘积等于上个数右侧乘积乘以上个数
				r *= nums[i+1];
			}

			retuan ans;
		}
};
{% endhighlight %}
