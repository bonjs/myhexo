---
title: 在pve lxc容器中使用k3s
date: 2025-03-28 17:46:11
tags: [k3s,k8s,pve,lxc,虚拟机,docker]
---
### pve中创建debian lxc容器

### 对应容器增加以下配置
~~~
lxc.apparmor.profile: unconfined
lxc.cgroup.devices.allow: a
lxc.cap.drop:
lxc.mount.auto: "proc:rw sys:rw"
~~~

### 创建开机脚本rc.local
~~~
#!/bin/sh -e

# Kubeadm 1.15 needs /dev/kmsg to be there, but it's not in lxc, but we can just use /dev/console instead
# see: https://github.com/kubernetes-sigs/kind/issues/662
if [ ! -e /dev/kmsg ]; then
    ln -s /dev/console /dev/kmsg
fi
	
# https://medium.com/@kvaps/run-kubernetes-in-lxc-container-f04aa94b6c9c
mount --make-rshared /
~~~
增加可执行权限
~~~bash
chmod +x /etc/rc.local
~~~

### 将开机脚本转为服务
开机执行/etc/rc.local，可将此操作注册为服务

创建/etc/systemd/system/rc-local.service文件
~~~
vim /etc/systemd/system/rc-local.service
~~~

填充以下内容
~~~
[Unit]
Description=/etc/rc.local Compatibility
Documentation=man:systemd.rc.local.service(8)
After=network.target

[Service]
Type=forking
ExecStart=/etc/rc.local start
TimeoutSec=0
RemainAfterExit=true

[Install]
WantedBy=multi-user.target
~~~

然后重启
### 安装k3s
~~~bash
curl -sfL https://get.k3s.io | sh -
~~~

查看服务状态
~~~
systemctl status k3s
~~~

查看k3s节点状态，如果显示Ready，则已成功
~~~
kubectl  get node
~~~

