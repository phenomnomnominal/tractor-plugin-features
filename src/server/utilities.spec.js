/* global describe:true, it:true */

// Test setup:
import { expect } from '../../test-setup';

// Under test:
import { getConfig } from './utilities';

describe('tractor-plugin-features - utilities:', () => {
    describe('getConfig', () => {
        it('should create the config object', () => {
            let featuresConfig = {};
            let tractorConfig = {
                features: featuresConfig
            };

            let config = getConfig(tractorConfig);

            expect(config).to.equal(featuresConfig);
            expect(config.directory).to.equal('./tractor/features');
        });

        it('should allow for a custom directory to be set', () => {
            let tractorConfig = {
                features: {
                    directory: './src'
                }
            };

            let config = getConfig(tractorConfig);

            expect(config.directory).to.equal('./src');
        });
    });
});
