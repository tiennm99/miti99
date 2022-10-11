+++ 
draft = false
date = 2020-05-02T07:00:00+07:00
title = "Kích hoạt Numlock khi khởi động với LightDM"
description = ""
slug = "" 
tags = []
categories = []
externalLink = ""
series = []
+++

Cài đặt numlockx:

```shell
yay -S numlockx
```

Mở file `/etc/lightdm/lightdm.conf`, thêm dòng như sau:

```shell
[Seat:*]
greeter-setup-script=/usr/bin/numlockx on
```

Vậy là xong!!
