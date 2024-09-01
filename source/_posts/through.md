---
title: pve显卡直通
date: 2022-03-14 23:17:19
tags: pve
---

在pve上实现显卡直通
## 第一步：
更新grub

```shell
vi /etc/default/grub
GRUB_CMDLINE_LINUX_DEFAULT="quiet intel_iommu=on pcie_acs_override=downstream,multifunction iommu=pt video=efifb:off,vesafb:off pci=assign-busses"

```

生效
```shell
update-grub
```

## 第二步
modprobe设置
修改/etc/modules, 增加内容
```shell
vfio 
vfio_iommu_type1 
vfio_pci 
vfio_virqfd
```
## 第四步
屏蔽驱动
vi /etc/modprobe.d/pve-blacklist.conf

```shell

blacklist nvidiafb
blacklist snd_soc_skl
blacklist snd_sof_pci
blacklist snd_hda_intel
blacklist snd_hda_codec_hdmi
blacklist snd_hda_codec
blacklist snd_hda_core
blacklist i915
blacklist snd_sof_pci_intel_cnl
```

配置生效

```shell
update-initramfs -u -k all
```

## 第四步
根据`lspci -n -s 00:02`查得显卡id，我的核显是`00:02.0 0300: 8086:3e92',将查得的id`8086:3e92`配置写入`/etc/modprobe.d/vfio.conf`,如下：

```shell
echo "options vfio-pci ids=8086:3e92" >> /etc/modprobe.d/vfio.conf
```

kvm配置
```shell
echo "options kvm ignore_msrs=1" >> /etc/modprobe.d/kvm.conf
```
信任设备允许不安全中断
```shell
'echo "options vfio_iommu_type1 allow_unsafe_interrupts=1" > /etc/modprobe.d/iommu_unsafe_interrupts.conf'
```

重启 
```shell
reboot
```

查看是否生效
```shell
lsmod | grep vfio
```

