# debuglog perf issues

## `noop` debug logger has a performance cost

Even though the `NODE_DEBUG` environment variable doesn't enable debugging, Node.js' built-in [debuglog](https://nodejs.org/docs/latest/api/util.html#utildebuglogsection-callback) logic still has performance issues.
Once there are more than 2 inputs to the `debug logger`, e.g.: `debug(1, 2, 3)`, there is a significant performance degradation.

It's even slower than the [debug](https://github.com/debug-js/debug) module.

```bash
node index.js

clk: ~2.92 GHz
cpu: Apple M1
runtime: node 22.14.0 (arm64-darwin)

benchmark                                  avg (min … max) p75 / p99    (min … top 1%)
---------------------------------------------------------- -------------------------------
debug()                                      47.85 ns/iter  46.35 ns █                    
                                    (44.98 ns … 200.28 ns)  75.96 ns █                    
                                   (115.86  b … 290.88  b) 216.28  b ██▂▂▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁

debug(arg1)                                   2.56 ns/iter   2.21 ns █                    
                                      (1.68 ns … 98.05 ns)  27.28 ns █                    
                                   ( 17.26  b …  88.13  b)  56.15  b █▃▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁

debug(arg1, arg2)                             3.01 ns/iter   2.53 ns █                    
                                      (1.90 ns … 64.26 ns)  27.25 ns █                    
                                   (  5.51  b … 104.13  b)  64.14  b █▇▁▂▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁

debug(arg1, arg2, arg3)                     132.69 ns/iter 131.35 ns █                    
                                   (125.61 ns … 360.89 ns) 173.87 ns █                    
                                   (403.11  b … 723.61  b) 560.22  b ███▃▂▂▁▁▁▁▂▃▂▂▂▁▁▁▁▁▁

debug(arg1, arg2, arg3, arg4)               163.54 ns/iter 162.55 ns █                    
                                   (157.39 ns … 216.86 ns) 194.57 ns █▆                   
                                   (459.11  b … 734.34  b) 616.27  b ██▄▄▃▁▂▁▁▁▁▁▁▁▃▄▃▁▁▁▁

debug(arg1, arg2, arg3, arg4, arg5)         187.07 ns/iter 186.36 ns ▃█                   
                                   (179.78 ns … 236.07 ns) 217.53 ns ██                   
                                   (527.11  b … 841.08  b) 672.08  b ██▅▆▃▂▂▂▁▁▁▁▁▁▃▄▄▂▂▁▁

debug(arg1, arg2, arg3, arg4, arg5, arg6)   210.93 ns/iter 211.41 ns █▇                   
                                   (201.86 ns … 348.94 ns) 253.17 ns ██                   
                                   (479.17  b … 894.32  b) 727.92  b ███▅▃▃▁▁▁▁▂▇▅▂▂▁▂▁▁▁▁

debugjs()                                     7.87 ns/iter   7.69 ns  █                   
                                      (7.43 ns … 45.62 ns)  10.94 ns  █▃                  
                                   (  0.12  b … 144.29  b)  29.87  b ▅██▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁

debugjs(arg1)                                 6.71 ns/iter   6.67 ns █                    
                                      (6.63 ns … 15.32 ns)   8.89 ns █                    
                                   (  0.10  b … 156.15  b)   0.17  b █▃▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁

debugjs(arg1, arg2)                           6.77 ns/iter   6.75 ns █ ▆                  
                                      (6.60 ns … 58.39 ns)   8.43 ns █ █                  
                                   (  0.10  b …  36.25  b)   0.13  b █▅█▂▁▁▂▁▁▁▁▁▁▁▁▁▁▁▁▁▁

debugjs(arg1, arg2, arg3)                     6.64 ns/iter   6.59 ns █                    
                                      (6.55 ns … 17.00 ns)   7.78 ns █                    
                                   (  0.10  b …  50.12  b)   0.13  b ██▁▁▁▁▁▁▂▁▁▁▁▁▁▁▁▁▁▁▁

debugjs(arg1, arg2, arg3, arg4)               6.78 ns/iter   6.76 ns   █                  
                                      (6.61 ns … 29.80 ns)   8.48 ns   █                  
                                   (  0.02  b …  35.27  b)   0.13  b █▇█▂▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁

debugjs(arg1, arg2, arg3, arg4, arg5)         6.73 ns/iter   6.71 ns █▅                   
                                     (6.55 ns … 159.36 ns)   8.98 ns ██                   
                                   (  0.02  b …  35.27  b)   0.04  b ██▄▁▂▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁

debugjs(arg1, arg2, arg3, arg4, arg5, arg6)   8.63 ns/iter   8.37 ns █                    
                                      (7.91 ns … 39.79 ns)  33.40 ns █                    
                                   (  0.02  b …  46.04  b)  45.72  b █▂▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁

                                            ┌                                            ┐
                                                    ┬    ╷
                                    debug()         │────┤
                                                    ┴    ╵
                                            ┬    ╷
                                debug(arg1) │────┤
                                            ┴    ╵
                                            ┬    ╷
                          debug(arg1, arg2) │────┤
                                            ┴    ╵
                                                                  ┌┬       ╷
                    debug(arg1, arg2, arg3)                       ││───────┤
                                                                  └┴       ╵
                                                                        ┌┬     ╷
              debug(arg1, arg2, arg3, arg4)                             ││─────┤
                                                                        └┴     ╵
                                                                            ┌┬     ╷
        debug(arg1, arg2, arg3, arg4, arg5)                                 ││─────┤
                                                                            └┴     ╵
                                                                                ┌┬┐      ╷
  debug(arg1, arg2, arg3, arg4, arg5, arg6)                                     ││├──────┤
                                                                                └┴┘      ╵
                                             ┬╷
                                  debugjs()  │┤
                                             ┴╵
                                             ┬
                              debugjs(arg1)  │
                                             ┴
                                             ┬
                        debugjs(arg1, arg2)  │
                                             ┴
                                             ┬
                  debugjs(arg1, arg2, arg3)  │
                                             ┴
                                             ┬
            debugjs(arg1, arg2, arg3, arg4)  │
                                             ┴
                                             ┬
      debugjs(arg1, arg2, arg3, arg4, arg5)  │
                                             ┴
                                             ┬    ╷
debugjs(arg1, arg2, arg3, arg4, arg5, arg6)  │────┤
                                             ┴    ╵
                                            └                                            ┘
                                            1.68 ns          127.43 ns           253.17 ns

summary
  debug(arg1)
   1.18x faster than debug(arg1, arg2)
   2.59x faster than debugjs(arg1, arg2, arg3)
   2.62x faster than debugjs(arg1)
   2.63x faster than debugjs(arg1, arg2, arg3, arg4, arg5)
   2.64x faster than debugjs(arg1, arg2)
   2.65x faster than debugjs(arg1, arg2, arg3, arg4)
   3.07x faster than debugjs()
   3.37x faster than debugjs(arg1, arg2, arg3, arg4, arg5, arg6)
   18.69x faster than debug()
   51.83x faster than debug(arg1, arg2, arg3)
   63.87x faster than debug(arg1, arg2, arg3, arg4)
   73.06x faster than debug(arg1, arg2, arg3, arg4, arg5)
   82.38x faster than debug(arg1, arg2, arg3, arg4, arg5, arg6)
```

## Improve it by one line

It's possible to improve the performance of `debuglog` with a single line of code.
The benchmark result show `debug(arg1, arg2, arg3)` cost from `131.35 ns` down to `172.85 ps`, is 759 times faster!

> https://github.com/nodejs/node/pull/57494

```diff
function debuglogImpl(enabled, set, args) {
   if (debugImpls[set] === undefined) {
     if (enabled) {
       const pid = process.pid;
@@ -109,6 +109,8 @@ function debuglog(set, cb) {
     return enabled;
   };
   const logger = (...args) => {
+    // improve performance when debug is disabled, avoid calling `new SafeArrayIterator(args)`
+    if (enabled === false) return;
     switch (args.length) {
       case 1: return debug(args[0]);
       case 2: return debug(args[0], args[1]);
```

```bash
~/git/github.com/nodejs/node/node index.js
clk: ~3.17 GHz
cpu: Apple M1
runtime: node 24.0.0-pre (arm64-darwin)

benchmark                                  avg (min … max) p75 / p99    (min … top 1%)
---------------------------------------------------------- -------------------------------
debug()                                     167.27 ps/iter 172.85 ps           █          
                                     (142.33 ps … 9.80 ns) 183.11 ps           █          
                                   (  0.03  b …  55.01  b)   0.09  b ▁▁▁▁▁▁▁▁▁▁█▁▁▁▁█▁▁▁▁▁

debug(arg1)                                 166.15 ps/iter 162.84 ps              █       
                                    (142.33 ps … 10.77 ns) 173.10 ps              █       
                                   (  0.09  b …  66.31  b)   0.09  b ▁▁▁▁▁▁▁▁▁▁▁▁▁█▁▁▁▁▁▁▆

debug(arg1, arg2)                           166.08 ps/iter 162.84 ps           █          
                                     (142.33 ps … 8.63 ns) 183.11 ps           █          
                                   (  0.09  b …  16.11  b)   0.09  b ▁▁▁▁▁▁▁▁▁▁█▁▁▁▁▆▁▁▁▁▁

debug(arg1, arg2, arg3)                     167.06 ps/iter 172.85 ps           █          
                                    (142.33 ps … 14.17 ns) 183.11 ps           █          
                                   (  0.09  b … 103.20  b)   0.09  b ▁▁▁▁▁▁▁▁▁▁█▁▁▁▁█▁▁▁▁▁

debug(arg1, arg2, arg3, arg4)               173.23 ps/iter 172.85 ps  █                   
                                   (142.33 ps … 175.99 ns) 447.51 ps  █▂                  
                                   (  0.09  b …  23.60  b)   0.09  b ▁██▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁

debug(arg1, arg2, arg3, arg4, arg5)         164.79 ps/iter 162.84 ps              █       
                                     (142.33 ps … 8.78 ns) 173.10 ps              █       
                                   (  0.09  b …  28.22  b)   0.09  b ▁▁▁▁▁▁▁▁▁▁▁▁▁█▁▁▁▁▁▁▂

debug(arg1, arg2, arg3, arg4, arg5, arg6)   168.40 ps/iter 172.85 ps           █          
                                    (142.33 ps … 12.54 ns) 183.11 ps           █    ▂     
                                   (  0.10  b …  87.64  b)   0.10  b ▁▁▁▁▁▁▁▁▁▁█▁▁▁▁█▁▁▁▁▁

debugjs()                                     6.87 ns/iter   6.86 ns     █                
                                      (6.70 ns … 25.77 ns)   7.45 ns     █                
                                   (  0.10  b … 160.61  b)   0.22  b ▁▁▁▁█▂▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁

debugjs(arg1)                                 6.88 ns/iter   6.87 ns    █                 
                                      (6.74 ns … 15.93 ns)   7.53 ns    █                 
                                   (  0.10  b …  39.68  b)   0.12  b ▁▁▄█▃▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁

debugjs(arg1, arg2)                           7.05 ns/iter   7.03 ns   █                  
                                      (6.79 ns … 34.42 ns)   8.00 ns   █                  
                                   (  0.10  b …  35.35  b)   0.13  b ▁▁█▃▃▁▁▁▆▂▁▁▁▁▁▁▁▁▁▁▁

debugjs(arg1, arg2, arg3)                     6.10 ns/iter   6.08 ns    █                 
                                      (5.94 ns … 17.08 ns)   6.75 ns    █                 
                                   (  0.10  b …  32.22  b)   0.12  b ▂▁▁█▇▂▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁

debugjs(arg1, arg2, arg3, arg4)               6.16 ns/iter   6.15 ns   █                  
                                      (6.00 ns … 15.07 ns)   7.20 ns   █                  
                                   (  0.10  b …  42.10  b)   0.13  b ▂▁██▂▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁

debugjs(arg1, arg2, arg3, arg4, arg5)         6.20 ns/iter   6.14 ns    █                 
                                      (6.00 ns … 34.14 ns)   7.05 ns   ██                 
                                   (  0.10  b …  28.85  b)   0.12  b ▁▁██▂▂▁▁▁▃▁▁▁▁▁▁▁▁▁▁▁

debugjs(arg1, arg2, arg3, arg4, arg5, arg6)   6.65 ns/iter   6.37 ns █                    
                                     (6.17 ns … 146.92 ns)  13.52 ns █                    
                                   (  0.10  b …  42.10  b)   0.13  b █▅▃▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁

                                            ┌                                            ┐
                                            ┬
                                    debug() │
                                            ┴
                                            ┬
                                debug(arg1) │
                                            ┴
                                            ┬
                          debug(arg1, arg2) │
                                            ┴
                                            ┬
                    debug(arg1, arg2, arg3) │
                                            ┴
                                            ┬╷
              debug(arg1, arg2, arg3, arg4) │┤
                                            ┴╵
                                            ┬
        debug(arg1, arg2, arg3, arg4, arg5) │
                                            ┴
                                            ┬
  debug(arg1, arg2, arg3, arg4, arg5, arg6) │
                                            ┴
                                                                  ╷┬ ╷
                                  debugjs()                       ├│─┤
                                                                  ╵┴ ╵
                                                                  ╷┬ ╷
                              debugjs(arg1)                       ├│─┤
                                                                  ╵┴ ╵
                                                                  ╷┬  ╷
                        debugjs(arg1, arg2)                       ├│──┤
                                                                  ╵┴  ╵
                                                                ┬ ╷
                  debugjs(arg1, arg2, arg3)                     │─┤
                                                                ┴ ╵
                                                                ┬   ╷
            debugjs(arg1, arg2, arg3, arg4)                     │───┤
                                                                ┴   ╵
                                                                ┬  ╷
      debugjs(arg1, arg2, arg3, arg4, arg5)                     │──┤
                                                                ┴  ╵
                                                                ╷┌┬                      ╷
debugjs(arg1, arg2, arg3, arg4, arg5, arg6)                     ├┤│──────────────────────┤
                                                                ╵└┴                      ╵
                                            └                                            ┘
                                            142.33 ps           6.83 ns           13.52 ns

summary
  debug(arg1, arg2, arg3, arg4, arg5)
   1.01x faster than debug(arg1, arg2)
   1.01x faster than debug(arg1)
   1.01x faster than debug(arg1, arg2, arg3)
   1.02x faster than debug()
   1.02x faster than debug(arg1, arg2, arg3, arg4, arg5, arg6)
   1.05x faster than debug(arg1, arg2, arg3, arg4)
   37.02x faster than debugjs(arg1, arg2, arg3)
   37.39x faster than debugjs(arg1, arg2, arg3, arg4)
   37.62x faster than debugjs(arg1, arg2, arg3, arg4, arg5)
   40.34x faster than debugjs(arg1, arg2, arg3, arg4, arg5, arg6)
   41.71x faster than debugjs()
   41.75x faster than debugjs(arg1)
   42.79x faster than debugjs(arg1, arg2)
```
