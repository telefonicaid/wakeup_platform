## Introduction

[![Build Status](https://secure.travis-ci.org/telefonicaid/wakeup_platform.png)](http://travis-ci.org/telefonicaid/wakeup_platform/)

This project covers a complete platform to wakeup mobile phones from the IDLE state.

This is an evolution of the first implementation done into the notification-server (https://github.com/telefonicaid/notification_server) in which we learned a lot of things. Now this project will improve the first model covering more use-cases, more networks, ...

Also this version will allow third parties servers (under agreement, of course) wake-up their clients.

Finally this starts as a split of the notification-server project (wakeup and push are now independent projects)

## How it works

## Code organization

This is a meta repository which depends in these other ones:

```
wakeup_platform
  |
  |- wakeup_platform_global
  |    |
  |    \- wakeup_platform_common
  |
  |- wakeup_platform_local
  |    |
  |    \- wakeup_platform_common
  |
  \- wakeup_platform_documentation

```

## Standarization

We're also working in the standarization of this protocol. 

## Build

Per submodules (local & global)
