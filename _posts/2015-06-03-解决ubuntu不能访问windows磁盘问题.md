---
layout: post
title: 解决ubuntu不能访问windows磁盘问题
categories: ['myshare']
tags: ['linux']
published: True
img: 9

---

在ubuntu、windows双系统下，不能从ubuntu访问windows系统下的磁盘，导致这个问题的原因一般都是上次系统没有正常关闭导致

要想修复这个问题其实很简单，这里提供两种解决方法：

>1、以正常方式重启。。。当然我并不推荐这种方法

>2、使用`ntfsfix`命令修复windows系统下磁盘，使用方法为`sudo ntfsfix ` + 对应磁盘号即可；要想知道对应的磁盘号使用`fdisk -l`命令；例如修复命令为： `sudo ntfsfix /dev/sda3`

修复完成即可正常访问磁盘^_^
