// Config:
import { getConfig } from '@tractor/config-loader';
import { config } from './tractor/config';

config(getConfig());

// Plugin:
export { init } from './tractor/server/init';
export { run } from './tractor/server/run';
export { serve } from './tractor/server/serve';

// Promisify:
import Promise from 'bluebird';
Promise.promisifyAll(require('child_process'));
