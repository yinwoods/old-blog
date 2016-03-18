---
layout: post
title: LeetCode 237 Delete Node in a Linked List （数据结构）
categories: ['coding']
tags: ['algorithm']
published: True
img: 13

---

题意是删除单链表的某个节点，确实是基本没做过链表的题，导致一直在想怎么把待删除节点的上一个节点与下一个节点连接起来；很明显这么做很困难，因为单链表从当前节点找上一节点确实很困难。

正确的做法是令当前节点等于下一节点，然后把下一节点删除即可。

代码如下：

{% highlight cpp %}
/**
 
 * Definition for singly-linked list.
 
 * struct ListNode {
 
 *     int val;
 
 *     ListNode *next;
 
 *     ListNode(int x) : val(x), next(NULL) {}

 * };

 */
class Solution {
public:
    void deleteNode(ListNode* node) {
        if(node != NULL && node->next!=NULL) {
            node->val = (node->next)->val;
            node->next = (node->next)->next;
        }
    }
};
{% endhighlight %}
