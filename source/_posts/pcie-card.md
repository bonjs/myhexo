---
title: PCIe拆分卡DIY
date: 2024-01-08 02:28:56
tags: [PCIe]
---

我们相当大一部分用户的使用的是核显，并没有使用独立显卡，这样主板上的直连CPU的PCIe x16槽处于空闲状态，而其他所有的硬盘网卡只能通过南桥x4一个通道却处于空闲的状态，就像走小路堵的要死，而旁边的高速公路却关门不让使用，真是巨大的浪费，即使我们把平时的pcie扩展卡(如网卡)插在x16槽上，因为这些设备根本用不了16个通道，所以也是很大的浪费，然后就有了如何拆分x16通道问题,目前的解决方案一般有三种：
#### 1) 主板BIOS设备支持PCIe拆分
其实PCIe是否能拆分是由cpu和主板芯片组共同决定的，只是有的主板厂商没有在bios中放开此功能，对于bios中放开了此功能的主板来说， 只要设置下就可以了，一般的家用主板有x8+x4+x4, x4+x4+x4+x4，x8+x8几种情况（Interl 11代以后还会有更多的通道）

#### 2) 主板BIOS设备不支持PCIe拆分
对于此种情况，可以短接CPU触点的方式强制拆分，参照此文章[intel部分桌面级CPU的pcie通道拆分另类低成本实现](https://www.bilibili.com/read/cv15596863)

#### 3） 使用PLX拆分卡
此种拆分卡使用了plx芯片，性能上会有损耗，比不上cpu直通，主要是价格超贵，算了吧

对于1，2种情况，我们配置好拆分以后，需要一个pcie拆分卡，这也是我们今天文章的主角，

#### 首先还是在闲鱼上看到有现成的pcb裸板，价格还挺便宜，还是镀金的，虽然嘉立创可以免费打板，但我不会画，哈哈
![img](/image/pcie/pcb1.jpg)

#### 按卖家提供的bom清单采购
电容电阻
![img](/image/pcie/bom1.jpg)
时钟芯片
![img](/image/pcie/clock-chip.jpg)
pcie x8插槽
![img](/image/pcie/bom2.jpg)
焊接
![img](/image/pcie/pcb2.jpg)

初步完成
![img](/image/pcie/pcb3.jpg)

增加12v转3.3v模块(中兴ZXDN10)，增加此模块不影响功能，只是提高负载能力, 原板子上没有留位，自己刮铜箔吧
![img](/image/pcie/dc-dc.jpg)
调节下最右边对地电阻380欧时输出3.3v左右
![img](/image/pcie/ZXDN10.jpeg)

插上三块硬盘测试
![img](/image/pcie/pcb4.jpg)

阻断原3.3v接口,以防出现意外电压对主板产生影响或损坏
![img](/image/pcie/pcb5.jpg)

顺便晒下自己焊的另一个板子，当然自己只是纯焊接
![img](/image/pcie/pcie-pcb4.jpg)

