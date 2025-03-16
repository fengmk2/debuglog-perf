import { debuglog } from 'node:util';
import { run, bench, boxplot, summary } from 'mitata';

const debug = debuglog('test');

boxplot(() => {
  summary(() => {
    bench('debug()', () => {
      debug();
    });

    bench('debug(arg1)', () => {
      debug('arg1');
    });

    bench('debug(arg1, arg2)', () => {
      debug('arg1', 'arg2');
    });

    bench('debug(arg1, arg2, arg3)', () => {
      debug('arg1', 'arg2', 'arg3');
    });

    bench('debug(arg1, arg2, arg3, arg4)', () => {
      debug('arg1', 'arg2', 'arg3', 'arg4');
    });
  });
});

await run();
