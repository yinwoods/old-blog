---
layout: post
title: python中的context manager
categories: ['coding']
tags: ['python']
published: True
img: 53

---

最近在读python进阶类书籍《Intermediate Python》，看到后面有一章讲到`context manager`，讲的很浅，我也没看懂。于是自己抽时间搜集了网上的一些资料，整理如下：

python中的`context manager`也叫做上下文管理器，主要功能是确保代码块始终能够得到正确的‘善后’处理。有点像java中的`try 	... catch 	... finally 	...`

对于打开文件读写，我们都知道下面的实现方式更好：

```python
with open('file') as f:
    for line in f:
    	print(line)
```

但这种方式为什么更好呢？原因在于使用`with`可以执行`context manager`的相应函数，确保被打开的文件始终能够被关闭。如果我们自己手动`open()`、`close()`则可能会因为中间代码产生的异常导致`close()`无法执行。因此使用`with`可以让代码既简洁又有效。

下面接着说一说`context manager`的功能与用法。

### 管理资源

`context manager`最常被用于管理资源，事实上，这也是很多时候我们使用它的原因。

当我们打开一个文件时，程序会占有对应的资源（文件描述符），而资源的管理则由操作系统来完成，也就是说同一时间能够打开的文件或进程是有限的。

例如，运行下面这份代码：

```python
files = []
for x in range(100000):
    files.append(open('foo.txt', 'w'))
```

在mac os或linux上运行这份代码很有可能会产生OSError而导致中断，而在windows上运行程序则可能导致系统直接卡死。

那么问题的原因是什么呢？

答：是*内存泄露！* 这里的泄露原因是指打开文件后但未关闭。

为了避免对文件操作时产生上述的错误，有两种解决方法：

> 1、避免同时打开超过操作系统上限个数个文件；

> 2、每次打开文件后关闭文件；


毫无疑问，这里2的操作更好，因为能够更好地实现高层抽象并解决内存泄露问题。

先说1：在unix上`ulimit -n`可以查看同时打开文件描述符上限，在写代码时确保同时打开的文件数不超过上限值即可。但是这里并没有解决根本问题：内存泄露！

再说2：我们当然可以为上面的代码添加close()函数，可是如果打开文件或者对文件内容处理时产生异常，那么后面的`close()`就无法被执行，从而导致内存泄露。

`context manager`正是用于处理这种情况的一个接口：

```python
with something_that_returns_a_context_manager() as my_resource:
    do_something(my_resource)
    ...
    print('done using my_resource')
```

使用`with`，我们可以操作任何一个返回上下文管理器的函数（例如内置函数`open()`）；`with`能够保证当相应代码块内的代码执行完毕时，始终调用一个包含清理资源的‘善后’函数。这个‘善后’函数就定义在`context manager`中。

实现一个最简单的context manager只要求包含`__enter__()`函数以及`__exit__()`。

> `__enter__()`执行操作并返回被管理的资源；

> `__exit__()`则清理资源，无返回。

例如我们通过以下代码创建一个自己的`context manager`：

```python
class File():
    
    def __init__(self, filename, mode):
        self.filename = filename
        self.mode = mode
        
    def __enter__(self):
        self.open_file = open(self.filename, self.mode)
        return self.open_file
        
    def __exit__(self):
        self.open_file.close()
        
files = []
for _ in range(100000):
    with File('foo.txt', 'w') as f:
        files.append(f.write('foo'))
```

这里`__enter__()`打开文件，并返回；`__exit__()`则关闭文件。

### 其他有用的资源管理器

很多库中也包含资源管理器，例如`zipfile.ZipFile`、`subprocess.Popen`、`tarfile.TarFile`、`telnet.Telnet`、`pathlib.Path`等。其实，在使用完资源之后调用`close()`方法的都是`context manager`。

### 关于`contextlib`

`contextlib`模块包含了许多创建、使用`context manager`的工具。

例如使用`@contextmanager`装饰器来创建一个`context manager`。具体的创建方法是使用`@contextmanager`来装饰只包含一个`yield`语句的`generator`函数。在`yield`之前的部分都被视为`__enter__()`函数内容，而之后的部分则是`__exit__()`函数内容。下面让我们用这种方法来重写`File()`:

```python
from contextlib import contextmanager

@contextmanager
def open_file(path, mode):
    the_file = open(path, mode)
    yield the_file
    the_file.close()
    
files = []

for x in range(100000):
    with open_file('foo.txt', 'w') as f:
        files.append(f)

```

对比后可以发现使用这种方法的代码更加简洁。

另外有一个很简单的例子可以帮助你理解`@contextmanager`

```python
from contextlib import contextmanager

@contextmanager
def tag(name):
    print("<%s>" % name)
    yield
    print("</%s>" % name)
    
with tag("h1"):
    print("hello, world!")
```

输出：`<h1>hello, world!</h1>`

另外也可以通过`contextlib.ContextDecorator`来实现自己的`context manager`装饰器。例如接着使用上面的例子来说明：

```python
from contextlib import ContextDecorator

class makeparagraph(ContextDecorator):
    def __enter__(self):
        print('<p>')
        return self
        
    def __exit__(self, *exc):
        print('</p>')
        return False
        
@makeparagraph
def emit_html():
    print('Here is some non-HTML')
```

执行`emit_html()`
会输出`<p>Here is some non-HTML</p>`

### 参考文章：

> - [PEP 34](https://www.python.org/dev/peps/pep-0343/)

> - [Python with Context Managers](https://jeffknupp.com/blog/2016/03/07/python-with-context-managers/)