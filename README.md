# debuglog perf issues

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
