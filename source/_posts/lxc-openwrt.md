---
title: 在pve lxc容器中安装openwrt
date: 2023-6-28 00:01:23
tags: [pve, openwrt]
---


## 第一步：

下载一个还有rootfs.tar.gz字样的openwrt镜像，如：[openwrt-23.05.1-x86-64-rootfs.tar.gz](https://mirrors.qvq.net.cn/openwrt/releases/23.05.1/targets/x86/64/openwrt-23.05.1-x86-64-rootfs.tar.gz)
上传到pve主机中`/var/lib/vz/template/cache`(这是pve lxc镜像默认目录)目录下，


## 第二步：
执行以下操作(id请更换为一个不存在的id)

```shell
pct create 222 local:vztmpl/openwrt-23.05.1-x86-64-rootfs.tar.gz \
	--rootfs local-lvm:1 \
	--ostype unmanaged \
	--hostname openwrt-LXC \
	--arch amd64 \
	--cores 6 \
	--memory 1024 \
	--swap 0 \
	-net0 bridge=vmbr0,name=eth0 -net1 bridge=vmbr1,name=eth1   
```

## 第三步：
增加勾子脚本
```shell
mkdir /var/lib/vz/snippets
cp /usr/share/pve-docs/examples/guest-example-hookscript.pl /var/lib/vz/snippets/hookscript.pl
vim /var/lib/vz/snippets/hookscript.pl

//post-start处增加
system("lxc-device add -n $vmid /dev/ppp");
system("lxc-device add -n $vmid /dev/net/tun");
print "$vmid started successfully.\n";
```
## 第四步：
修改对应容器配置文件
vim /etc/pve/lxc/222.conf，增加以下配置

```shell
lxc.include: /usr/share/lxc/config/openwrt.common.conf
lxc.cgroup.devices.allow: c 108:0 rwm
lxc.cgroup.devices.allow: a
lxc.cgroup2.devices.allow: a
lxc.mount.auto: proc:mixed sys:ro cgroup:mixed
lxc.mount.entry: /dev/net/tun dev/net/tun none rw,bind,create=file 0 0
lxc.mount.entry: /dev/ppp dev/ppp none rw,bind,optional,create=file 0 0
lxc.net.1.type: veth
lxc.net.1.link: vmbr1
lxc.net.1.flags: up
lxc.net.1.name: eth1
```

## 第四步：
在pve控制台中启动对应的容器,进入容器对应控制台,修改网络参数

```shell
vim /etc/config/network
```

修改对应的ip地址，
```shell
config interface 'lan'
	option device 'br-lan'
	option proto 'static'
	option ipaddr '192.168.1.1'
	option netmask '255.255.255.0'
	option ip6assign '60'

```

## 第五步：

用电脑网络连接软路由，修改以太网ip，和以前ip地址处于一个网段内，不要重复，以便在电脑上能访问后台地址


## 第六步：

进入到`192.168.1.1`, 用户名root，密码空登录，然后更改密码，再点击`网络` `接口` `wan`，`编辑`，`常规设置`，修改协议为PPPoE,保存，填写你的上网帐号及密码，保存并应用,
如没有意外，等待一会就可以看到有公网ip生成了


另外，为了能在接入此openwrt路由网络的设备中能访问pve，需要把pve的网关设置为192.168.1.1
