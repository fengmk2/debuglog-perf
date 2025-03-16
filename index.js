import { debuglog as createDebuglog } from 'node:util';
import createDebug from 'debug';
import { run, bench, boxplot, summary } from 'mitata';

const debug = createDebuglog('test');
const debugjs = createDebug('test');

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

    bench('debug(arg1, arg2, arg3, arg4, arg5)', () => {
      debug('arg1', 'arg2', 'arg3', 'arg4', 'arg5');
    });

    bench('debug(arg1, arg2, arg3, arg4, arg5, arg6)', () => {
      debug('arg1', 'arg2', 'arg3', 'arg4', 'arg5', 'arg6');
    });

    bench('debugjs()', () => {
      debugjs();
    });

    bench('debugjs(arg1)', () => {
      debugjs('arg1');
    });

    bench('debugjs(arg1, arg2)', () => {
      debugjs('arg1', 'arg2');
    });

    bench('debugjs(arg1, arg2, arg3)', () => {
      debugjs('arg1', 'arg2', 'arg3');
    });

    bench('debugjs(arg1, arg2, arg3, arg4)', () => {
      debugjs('arg1', 'arg2', 'arg3', 'arg4');
    });

    bench('debugjs(arg1, arg2, arg3, arg4, arg5)', () => {
      debugjs('arg1', 'arg2', 'arg3', 'arg4', 'arg5');
    });

    bench('debugjs(arg1, arg2, arg3, arg4, arg5, arg6)', () => {
      debugjs('arg1', 'arg2', 'arg3', 'arg4', 'arg5', 'arg6');
    });
  });
});

await run();
