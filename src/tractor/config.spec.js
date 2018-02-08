/* global describe:true, it:true */

// Test setup:
import { expect } from '@tractor/unit-test';

// Under test:
import { config } from './config';

describe('tractor-plugin-features - tractor/config:', () => {
    describe('config', () => {
        it('should create the config object', () => {
            let featuresConfig = {};
            let tractorConfig = {
                features: featuresConfig
            };

            let processed = config(tractorConfig);

            expect(processed).to.equal(featuresConfig);
            expect(processed.directory).to.equal('./tractor/features');
        });

        it('should allow for a custom directory to be set', () => {
            let tractorConfig = {
                features: {
                    directory: './src'
                }
            };

            let processed = config(tractorConfig);

            expect(processed.directory).to.equal('./src');
        });
    });
});
