---
title: 两个openwrt路由器下异地组建wireguard内网
date: 2024-01-05 02:25:15
tags: [openwrt, wireguard,vpn]
---
已有以下A，B两个openwrt, 期望组建10.0.0.0/24网段内网:


OpenWrt路由器A IP：`192.168.0.1, 10.0.0.1`
OpenWrt路由器B IP：`192.168.6.1, 10.0.0.2`

### 首先，在两个openwrt路由器上上安装wireguard, 以下以A为例(B和A一样，只是把对应信息改为B的,只有个别不同)
如果没有安装wireguard要先安装wireguard, `系统` -> `软件包`，过滤器输入wireguard,选择luci-app-wireguard，点击对应安装, 成功后重启(一定要重启，否则下面接口选择协议的时候会找不到WireGuard VPN协议)

### 防火墙设置
`网络` -> `防火墙` , 添加，名称wg，下面的入站数据，出站数据，转发都选择允许, 下面允许转发到目标区域, 以及允许来自源区域的转发都选择lan.
然后切换到自定义规则页，增加以下规则：
`iptables -t nat -A POSTROUTING -s 10.0.0.0/24 -o br-lan -j MASQUERADE`
保存

### 协议接口及对端设置
`接口` -> `添加新接口`， 名称wg0, 协议选择`WireGuard VPN`, 点击创建接口，进入wg0配置界面，
![img](/image/wireguard/wg1.jpg)
点击`生成新的密钥对`生成私钥和公钥(为方便后面配置可先记到记事本中),IP地址`192.168.0.1/24,10.0.0.1/24`(如果是B路由器则填写`192.168.6.1/24,10.0.0.2/24`). 然后切换到防火墙tab页，
![img](/image/wireguard/wg2.jpg)
创建/分配防火墙区域选择wg，再切换到对端页添加对端,
![img](/image/wireguard/wg3.jpg)

### 设置静态路由
`网络` -> `路由`, 添加,
![img](/image/wireguard/wg4.jpg)
接口选择`wg0`, 路由类型`unicast`, 目标为B路由器网段`192.168.6.0/24`, 网关为A路由器WireGuardm网段地址`10.0.0.1`

### 如无意外，此时已经组网成功，`状态` -> `WireGuard`查看
![img](/image/wireguard/wg5.jpg)
