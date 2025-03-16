# debuglog perf issues

```bash
node index.js
clk: ~2.98 GHz
cpu: Apple M1
runtime: node 22.14.0 (arm64-darwin)

benchmark                    avg (min … max) p75 / p99    (min … top 1%)
-------------------------------------------- -------------------------------
debug()                        46.88 ns/iter  45.45 ns █                    
                      (44.62 ns … 176.14 ns)  72.35 ns █                    
                     ( 98.71  b … 263.59  b) 184.25  b █▆▁▂▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁

debug(arg1)                     2.56 ns/iter   2.22 ns █                    
                       (1.67 ns … 121.28 ns)  26.25 ns █                    
                     ( 33.26  b …  88.13  b)  56.15  b █▄▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁

debug(arg1, arg2)               2.87 ns/iter   2.48 ns █                    
                        (1.98 ns … 92.39 ns)  26.76 ns █                    
                     ( 33.26  b …  96.13  b)  64.09  b █▃▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁

debug(arg1, arg2, arg3)       131.14 ns/iter 128.78 ns █                    
                     (126.05 ns … 293.04 ns) 158.59 ns █▆                   
                     (378.98  b … 691.47  b) 528.21  b ██▃▃▂▁▂▁▁▁▁▁▁▁▁▂▃▃▂▁▁

debug(arg1, arg2, arg3, arg4) 164.61 ns/iter 166.32 ns █                    
                     (157.33 ns … 235.31 ns) 202.22 ns █▃                   
                     (427.13  b … 702.20  b) 584.09  b ██▃▅▄▂▂▁▁▁▁▂▃▄▂▂▁▁▁▁▁

                              ┌                                            ┐
                                        ┬     ╷
                      debug()           │─────┤
                                        ┴     ╵
                              ┬     ╷
                  debug(arg1) │─────┤
                              ┴     ╵
                              ┬     ╷
            debug(arg1, arg2) │─────┤
                              ┴     ╵
                                                          ┌┬     ╷
      debug(arg1, arg2, arg3)                             ││─────┤
                                                          └┴     ╵
                                                                 ┌─┬       ╷
debug(arg1, arg2, arg3, arg4)                                    │ │───────┤
                                                                 └─┴       ╵
                              └                                            ┘
                              1.67 ns          101.94 ns           202.22 ns

summary
  debug(arg1)
   1.12x faster than debug(arg1, arg2)
   18.31x faster than debug()
   51.21x faster than debug(arg1, arg2, arg3)
   64.29x faster than debug(arg1, arg2, arg3, arg4)
```
