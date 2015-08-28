---
layout: post
title: LeetCode 2 Add Two Numbers （单链表相加）
categories: ['coding']
tags: ['algorithm']
published: True
img: 18

---

题目是给两个链表，对两个链表进行相加操作

相加结果仅取个位，若大于10，向下一位进1

这题要考虑的情况主要有以下几种：

> 1、一个链表为空，返回另一个非空链表

> 2、两个都为空，返回空

> 3、两个链表长度不同，处理完相同部分，对较长的链表单独处理

> 4、存在连续进位

其实题目比较简单，但自己在指针操作方面确实不熟练，因此花费了很多时间

一个比较容易处理的方法就是用vector保存相加结果，最后放到一个链表中即可

代码如下：

```CPP
//time:40ms
class Solution {
    public:
        ListNode* addTwoNumbers(ListNode* l1, ListNode* l2) {

            if(!l1 && !l2) return l1;
            if(!l1 || !l2) {
                if(!l1) return l2;
                if(!l2) return l1;
            }

            vector<int> vec;

            int tmp = 0;
            while(l1 && l2) {
                vec.push_back((l1->val+l2->val+tmp)%10);
                tmp = (l1->val+tmp+l2->val)/10;
                l1 = l1->next;
                l2 = l2->next;
            }

            ListNode* ans = new ListNode(0);
            ListNode* res = ans;
            for(int i=0; i<vec.size(); ++i) {
                ans->val = vec[i];
                if(i == vec.size()-1) break;
                ans->next = new ListNode(0);
                ans = ans->next;
            }
            while(l1 || l2) {
                if(l1) {
                    int x = l1->val;
                    l1->val = (l1->val+tmp)%10;
                    tmp = (x+tmp)/10;
                    ans->next = l1;
                    l1 = l1->next;
                }
                if(l2) {
                    int x = l2->val;
                    l2->val = (l2->val+tmp)%10;
                    tmp  = (x+tmp)/10;
                    ans->next = l2;
                    l2 = l2->next;
                }
                ans = ans->next;
            }
            if(tmp) {
                ans->next = new ListNode(tmp);
            }

            return res;
        }
};
```

其实完全可以不用`vector`的，依次遍历并处理即可，遵循一个原则`每次需要时对存答案的单链表进行扩展`

代码如下：

```CPP
//time:36ms
class Solution {
    public:
        ListNode* addTwoNumbers(ListNode* l1, ListNode* l2) {

            if(!l1 && !l2) return l1;
            if(!l1 || !l2) {
                if(!l1) return l2;
                if(!l2) return l1;
            }

            ListNode* ans = new ListNode(0);
            ListNode* end = ans;
            ListNode* ll1 = l1;
            ListNode* ll2 = l2;

            int tmp = 0;
            while(l1 && l2) {
                ans->val = (l1->val+l2->val+tmp)%10;
                tmp = (l1->val+tmp+l2->val)/10;
                l1 = l1->next;
                l2 = l2->next;

                if(l1 && l2) {
                    ans->next = new ListNode(0);
                    ans = ans->next;
                }
            }

            if(l1 || l2) {
                ans->next = new ListNode(0);
                ans = ans->next;
            }

            while(l1 || l2) {
                if(l1) {
                    int x = l1->val;
                    ans->val = (l1->val+tmp)%10;
                    tmp = (tmp+x)/10;
                    l1 = l1->next;
                    if(l1) {
                        ans->next = new ListNode(0);
                        ans = ans->next;
                    }
                } 
                if(l2) {
                    int x = l2->val;
                    ans->val = (l2->val+tmp)%10;
                    tmp = (tmp+x)/10;
                    l2 = l2->next;
                    if(l2) {
                        ans->next = new ListNode(0);
                        ans = ans->next;
                    }
                }
            }
            if(tmp) {
                ans->next = new ListNode(tmp);
            }

            return end;
        }
};
```
