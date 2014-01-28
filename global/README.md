## Introduction

[![Build Status](https://secure.travis-ci.org/telefonicaid/wakeup_platform.png)](http://travis-ci.org/telefonicaid/wakeup_platform/)

This project covers a the local node for the platform used to wakeup mobile phones from the IDLE state.

This is an evolution of the first implementation done into the notification-server (https://github.com/telefonicaid/notification_server) in which we learned a lot of things. Now this project will improve the first model covering more use-cases, more networks, ...

Also this version will allow third parties servers (under agreement, of course) wake-up their clients.

Finally this starts as a split of the notification-server project (wakeup and push are now independent projects)

## How it works

## Code organization

The repository is organized with the following folders:

```
/ -> General folder (README, LICENSE, Makefile, ...)
/src -> Source code
/src/local -> Local wakeup node source code (the one installed into the mobile network)
/src/global -> Global wakeup server source code (the one which will act as a frontend for third parties and also send the wakeup orders to local nodes
/doc -> Manual (Doxygen source code)
/test -> Unit testing, Integration testing ...
/packages -> For Linux distributions (Debian, CentOS, RedHat,...) package templates
```

## Standarization

We're also working in the standarization of this protocol. 

## Build

Use:

```
make dev
```
To update libraries and node dependencies on each server

```
make all
```
To also create an output folder with final versions (ready for deployment) of your server.

```
make clean
```
To clean your working sandbox with temporal folders and files