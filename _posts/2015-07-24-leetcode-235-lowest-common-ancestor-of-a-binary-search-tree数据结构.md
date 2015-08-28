---
layout: post
title: LeetCode 235 Lowest Common Ancestor of a Binary Search Tree（数据结构）
categories: ['coding']
tags: ['algorithm']
published: True
img: 14

---

题意是对一颗给定的二叉搜索树，寻找两个节点的最短公共祖先，`ps:一个节点的最短公共祖先可以是它自己`

这里要考虑到二叉搜索树的性质：每个根节点左侧所有节点的值要比根节点值小，右侧所有节点的值要比根节点值大

所以我们应用这个性质递归操作即可：

> 1、若两个节点的值都比当前根节点值小，向左侧递归

> 2、若两个节点的值都比当前根节点值小，向右侧递归

> 3、若两个节点的值与根节点差值相乘小于等于0，说明当前节点为LCA

代码如下：

```CPP
/**
 * Definition for a binary tree node.
 * struct TreeNode {
 *     int val;
 *     TreeNode *left;
 *     TreeNode *right;
 *     TreeNode(int x) : val(x), left(NULL), right(NULL) {}
 * };
 */
class Solution {
public:
    TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {
        if(p->val<root->val && q->val<root->val) {
            return lowestCommonAncestor(root->left, p, q);
        }
        if(p->val>root->val && q->val>root->val) {
            return lowestCommonAncestor(root->right, p, q);
        }
        if((p->val-root->val)*(q->val-root->val) <= 0)
            return root;
    }
};
```
