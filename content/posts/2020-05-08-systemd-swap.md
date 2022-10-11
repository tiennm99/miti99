+++ 
draft = false
date = 2020-05-08T07:00:00+07:00
title = "systemd-swap"
description = ""
slug = "" 
tags = ["Arch", "Linux", "Systemd"]
categories = []
externalLink = ""
series = []
+++

Đây là một service nhằm tạo ra swap động theo thời gian. Khởi tạo ban đầu chỉ có 512MiB thôi, nhưng sẽ tăng lên một cách **tự động** khi bạn sử dụng. Cài đặt như sau:

```shell
yay -S systemd-swap
```

Trong file `/etc/systemd/swap.conf` cài đặt như sau:

```shell
swapfc_enabled=1
```

Sau đó enable service systemd-swap:

```shell
sudo systemctl enable systemd-swap
```

Vậy là xong!!!
