+++ 
draft = false
date = 2020-04-20T07:00:00+07:00
title = "Auto TRIM SSD"
description = ""
slug = "" 
tags = ["Arch", "Linux", "SSD"]
categories = []
externalLink = ""
series = []
+++

Package `util-linux` cung cấp `fstrim.service` và `fstrim.timer` trong `systemd` rồi, nên để sử dụng bạn chỉ cần chạy `fstrim.timer` là đủ. Thực hiện như sau:

```shell
sudo systemctl enable fstrim.timer
```

Thời gian mặc định là 1 tuần

Hẹn gặp lại!
