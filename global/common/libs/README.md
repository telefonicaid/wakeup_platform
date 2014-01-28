## Shared libraries

All libraries stored into this folder will be copied (hard linked) into each
server folder as 'shared_libs' when 'make' command is used.

If you create new libraries, you shall execute:

```
make dev
```

in order to have it accesible by your code.
